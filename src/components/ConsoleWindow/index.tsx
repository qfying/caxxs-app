import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

const ConsoleWindow: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const consoleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // 获取视窗边界
  const getViewportBounds = useCallback((): { maxX: number; maxY: number } => {
    const element = consoleRef.current;
    if (!element) return { maxX: 0, maxY: 0 };

    const rect = element.getBoundingClientRect();
    return {
      maxX: window.innerWidth - rect.width,
      maxY: window.innerHeight - rect.height,
    };
  }, []);

  // 限制位置在视窗范围内
  const clampPosition = useCallback(
    (x: number, y: number) => {
      const bounds = getViewportBounds();
      return {
        x: Math.max(0, Math.min(x, bounds.maxX)),
        y: Math.max(0, Math.min(y, bounds.maxY)),
      };
    },
    [getViewportBounds]
  );

  // 拖拽开始处理
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!consoleRef.current) return;

    const rect = consoleRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  }, []);

  // 拖拽移动处理（使用 requestAnimationFrame 优化性能）
  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const newX = clientX - dragOffset.x;
        const newY = clientY - dragOffset.y;

        const clampedPosition = clampPosition(newX, newY);
        setPosition(clampedPosition);
      });
    },
    [isDragging, dragOffset, clampPosition]
  );

  // 拖拽结束处理
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // 鼠标事件处理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 触摸事件处理
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 窗口大小改变时重新计算位置
  useEffect(() => {
    const handleResize = () => {
      const clampedPosition = clampPosition(position.x, position.y);
      setPosition(clampedPosition);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, clampPosition]);

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
    <div
      ref={consoleRef}
      className={styles.consoleWindow}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <div
        className={styles.header}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        Console
      </div>
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
