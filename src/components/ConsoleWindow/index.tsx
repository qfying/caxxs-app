import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

const ConsoleWindow: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  // 辅助函数：格式化参数
  const formatArgs = (args: any[]): string => {
    return args
      .map(arg => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';

        // 处理特殊对象类型
        if (arg instanceof Response) {
          return `Response {type: '${arg.type}', url: '${arg.url}', redirected: ${arg.redirected}, status: ${arg.status}, ok: ${arg.ok}}`;
        }

        if (arg instanceof Error) {
          return `Error: ${arg.message}`;
        }

        if (arg instanceof Date) {
          return arg.toISOString();
        }

        if (Array.isArray(arg)) {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return `[Array(${arg.length})]`;
          }
        }

        if (typeof arg === 'object') {
          try {
            // 尝试获取对象的关键属性
            const keys = Object.keys(arg);
            if (keys.length === 0) return '{}';

            // 对于复杂对象，只显示前几个属性
            const preview = keys
              .slice(0, 5)
              .map(key => {
                let value = arg[key];
                if (typeof value === 'object' && value !== null) {
                  if (value instanceof Date) {
                    value = value.toISOString();
                  } else if (Array.isArray(value)) {
                    value = `[Array(${value.length})]`;
                  } else {
                    value = '[Object]';
                  }
                }
                return `${key}: ${value}`;
              })
              .join(', ');

            const suffix =
              keys.length > 5 ? `, ...(${keys.length - 5} more)` : '';
            return `{${preview}${suffix}}`;
          } catch (e) {
            return arg.toString();
          }
        }

        return String(arg);
      })
      .join(' ');
  };

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    const newConsole = {
      log: (...args: any[]) => {
        setLogs(prevLogs => [...prevLogs, `[LOG] ${formatArgs(args)}`]);
        originalConsoleLog.apply(console, args);
      },
      error: (...args: any[]) => {
        setLogs(prevLogs => [...prevLogs, `[ERROR] ${formatArgs(args)}`]);
        originalConsoleError.apply(console, args);
      },
      warn: (...args: any[]) => {
        setLogs(prevLogs => [...prevLogs, `[WARN] ${formatArgs(args)}`]);
        originalConsoleWarn.apply(console, args);
      },
      info: (...args: any[]) => {
        setLogs(prevLogs => [...prevLogs, `[INFO] ${formatArgs(args)}`]);
        originalConsoleInfo.apply(console, args);
      },
    };

    (window as any).console = {
      ...console,
      log: newConsole.log,
      error: newConsole.error,
      warn: newConsole.warn,
      info: newConsole.info,
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
    };
  }, []);

  return (
    <div className={styles.consoleWindow}>
      <div className={styles.header}>Console</div>
      <div className={styles.logs}>
        {logs.map((log, index) => (
          <div key={index} className={styles.logEntry}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsoleWindow;
