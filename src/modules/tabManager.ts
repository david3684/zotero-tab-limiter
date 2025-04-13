import { getPref, setPref } from "../utils/prefs";

/**
 * TabManager class handles Zotero tab management functionality.
 * It monitors and enforces the maximum number of tabs allowed.
 */
export class TabManager {
  private static instance: TabManager;
  // 알림 ID를 저장하기 위한 필드를 추가합니다
  private notifierID: string = "tablimiter-notifier";
  // 설정 변경 감지를 위한 간격 (밀리초)
  private checkInterval: number = 3000;
  // 설정 감시 타이머 ID
  private timerID: number | null = null;
  // 마지막으로 확인한 최대 탭 설정값
  private lastMaxTabsSetting: number = 0;
  // 로그 활성화 여부
  private enableLogs: boolean = false;

  /**
   * Get the singleton instance of TabManager
   */
  public static getInstance(): TabManager {
    if (!TabManager.instance) {
      TabManager.instance = new TabManager();
    }
    return TabManager.instance;
  }

  /**
   * Register tab management hooks and listeners
   */
  public register(): void {
    // Register Zotero Notifier to monitor tab events
    Zotero.Notifier.registerObserver(
      {
        notify: (
          event: string,
          type: string,
          ids: string[] | number[],
          extraData: { [key: string]: any },
        ) => {
          if (type === "tab") {
            // 로그 출력 제거: 탭 이벤트 감지 시 알림 표시 안 함

            // 탭 추가 이벤트에서 탭 관리
            if (event === "add") {
              // 로그 출력 제거: 추가 시 알림 표시 안 함
              this.manageTabs();
            }
          }
          return;
        },
      },
      ["tab"],
      this.notifierID,
    );

    // 주기적으로 설정값 확인 및 탭 관리 (백업 메커니즘)
    this.startPeriodicCheck();

    // 초기 실행 시 현재 탭 관리
    this.manageTabs();

    // 현재 설정값 저장
    this.lastMaxTabsSetting = getPref("maxTabs") || 10;

    // 시작 메시지는 한 번만 표시
    if (this.enableLogs) {
      ztoolkit.log(
        `TabManager registered with max tabs setting: ${this.lastMaxTabsSetting}`,
      );
    }
  }

  /**
   * Start periodic check for preference changes and tab management
   */
  private startPeriodicCheck(): void {
    // 이미 타이머가 실행 중이라면 중단
    this.stopPeriodicCheck();

    // 메인 Zotero 창 가져오기
    const mainWindow = Zotero.getMainWindow();
    if (!mainWindow) {
      if (this.enableLogs) {
        ztoolkit.log("Can't access main window for timer", "error");
      }
      return;
    }

    // 주기적으로 설정과 탭 상태 확인
    this.timerID = mainWindow.setInterval(() => {
      try {
        // 현재 설정값 가져오기
        const currentMaxTabs = getPref("maxTabs");

        // 설정값이 변경되었는지 확인
        if (currentMaxTabs !== this.lastMaxTabsSetting) {
          if (this.enableLogs) {
            ztoolkit.log(
              `Max tabs setting changed: ${this.lastMaxTabsSetting} -> ${currentMaxTabs}`,
            );
          }
          this.lastMaxTabsSetting = currentMaxTabs;
          this.manageTabs();
        }
      } catch (e) {
        if (this.enableLogs) {
          ztoolkit.log(`Error in periodic check: ${e}`, "error");
        }
      }
    }, this.checkInterval);
  }

  /**
   * Stop periodic check timer
   */
  private stopPeriodicCheck(): void {
    if (this.timerID !== null) {
      // 메인 창을 통해 타이머 정리
      const mainWindow = Zotero.getMainWindow();
      if (mainWindow) {
        mainWindow.clearInterval(this.timerID);
        this.timerID = null;
      }
    }
  }

  /**
   * Unregister tab management hooks and listeners
   */
  public unregister(): void {
    // 알림 리스너 해제
    Zotero.Notifier.unregisterObserver(this.notifierID);

    // 주기적 검사 타이머 중단
    this.stopPeriodicCheck();
  }

  /**
   * Manage tabs according to the maximum tabs setting
   * This will close the oldest tabs if the number of tabs exceeds the limit
   */
  public async manageTabs(): Promise<void> {
    try {
      const maxTabs = getPref("maxTabs");

      if (!maxTabs || maxTabs <= 0) {
        return;
      }

      // Zotero_Tabs API를 사용하여 탭에 접근
      const mainWindow = Zotero.getMainWindow();
      if (!mainWindow || !mainWindow.Zotero_Tabs) {
        if (this.enableLogs) {
          ztoolkit.log("Unable to access Zotero_Tabs", "error");
        }
        return;
      }

      // 타입 에러를 우회하기 위해 any 타입 사용
      const zoteroTabs = mainWindow.Zotero_Tabs as any;

      // Zotero 7 버전에서는 실제 구현에 따라 메서드 이름이 다를 수 있음
      let tabs: any[] = [];

      try {
        // 여러 가지 가능한 메서드 시도
        if (typeof zoteroTabs.getTabs === "function") {
          tabs = zoteroTabs.getTabs();
        } else if (typeof zoteroTabs.getAll === "function") {
          tabs = zoteroTabs.getAll();
        } else if (typeof zoteroTabs._tabs !== "undefined") {
          tabs = [...zoteroTabs._tabs];
        } else {
          tabs = [];
        }
      } catch (e) {
        if (this.enableLogs) {
          ztoolkit.log(`Error getting tabs: ${e}`, "error");
        }
        return;
      }

      if (tabs.length > maxTabs) {
        // 탭 사용 시간 기준으로 정렬
        const sortedTabs = [...tabs].sort((a: any, b: any) => {
          const aTime =
            a._lastAccessed ||
            a.lastAccessed ||
            a.lastAccessTime ||
            a.createTime ||
            0;
          const bTime =
            b._lastAccessed ||
            b.lastAccessed ||
            b.lastAccessTime ||
            b.createTime ||
            0;
          return aTime - bTime;
        });

        // 가장 오래된 탭 목록
        const tabsToClose = sortedTabs.slice(0, tabs.length - maxTabs);

        // 각 탭 닫기
        for (const tab of tabsToClose) {
          try {
            // Zotero_Tabs.close 메서드 사용 - any 타입으로 변환하여 타입 에러 방지
            zoteroTabs.close(tab.id);
          } catch (closeError) {
            // 다른 방법으로 시도
            try {
              if (typeof zoteroTabs.closeTab === "function") {
                zoteroTabs.closeTab(tab.id);
              } else if (typeof zoteroTabs._closeTab === "function") {
                zoteroTabs._closeTab(tab.id);
              }
            } catch (alternativeError) {
              // 에러 발생 시 무시
            }
          }
        }
      }
    } catch (error: unknown) {
      // 예외 발생 시 무시
    }
  }
}

/**
 * Factory to manage plugin's tab management functionality
 */
export class TabManagerFactory {
  /**
   * Register the tab manager on plugin startup
   */
  public static registerTabManager() {
    const tabManager = TabManager.getInstance();
    tabManager.register();
  }

  /**
   * Unregister the tab manager on plugin shutdown
   */
  public static unregisterTabManager() {
    const tabManager = TabManager.getInstance();
    tabManager.unregister();
  }
}
