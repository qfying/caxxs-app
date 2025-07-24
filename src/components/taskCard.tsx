import React, { useRef, useState } from 'react';

type TaskItem = {
  name: string;
  time: string;
  state: string;
  company: string;
  lacate: string;
  id: number;
}

type Props = {
  carditem: TaskItem;
  onDelete?: (id: number) => void;
  cardFn?: () => void;


}

const TaskCard = ({ carditem, onDelete, cardFn }: Props) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const [touchitem, setTouchitem] = useState<TaskItem | null>(null);




  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchitem(carditem)
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startX;

    // 只允许向左滑动
    if (deltaX < 0) {
      setCurrentX(deltaX);
      // const translateX = Math.max(deltaX, -60); // 最大滑动60px（删除按钮宽度）
      if (cardRef.current) {
        // cardRef.current.style.transform = `translateX(${translateX}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    const threshold = -30; // 滑动阈值

    if (currentX < threshold) {
      setIsSwiped(true);
      if (cardRef.current) {
        // cardRef.current.style.transform = 'translateX(-60px)';
      }
    } else {
      setIsSwiped(false);
      if (cardRef.current) {
        // cardRef.current.style.transform = 'translateX(0px)';
        setTouchitem(null)

      }
    }
    setCurrentX(0);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(carditem.id);
    }
  };

  const getStatusText = (state: string) => {
    switch (state) {
      case '1':
        return '进行中';
      case '2':
        return '即将开始';
      case '3':
        return '已完成';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case '1':
        return '#4CAF50';
      case '2':
        return '#FF9800';
      case '3':
        return '#2196F3';
      default:
        return '#999999';
    }
  };



  return (
    <div onClick={cardFn} style={{
      position: 'relative',
      marginBottom: '10px',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: "space-between"
    }}>



      {/* 任务卡片 */}
      <div
        ref={cardRef}
        style={{
          width: touchitem?.id == carditem.id ? 'calc(100% - 70px)' : "100%",
          height: '106px',
          padding: "15px",
          gap: '8px',
          opacity: 1,
          borderRadius: '20px',
          borderWidth: '0.5px',
          background: '#0000001A',
          border: '0.5px solid rgba(255, 255, 255, 0.5)',
          // borderImageSource: 'linear-gradient(124.34deg, rgba(255, 255, 255, 0.135) 29.71%, rgba(255, 255, 255, 0.27) 55.17%, rgba(255, 255, 255, 0.135) 81.42%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.3s ease',
          position: 'relative',
          zIndex: 2,
          cursor: 'pointer'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 第一行：任务名称、时间、状态 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            flex: 1,
            marginRight: '10px',
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }}>
            {carditem.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'white' }}>⏰ {carditem.time}</span>
            <div style={{
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'white',
              backgroundColor: getStatusColor(carditem.state)
            }}>
              {getStatusText(carditem.state)}
            </div>
          </div>
        </div>

        {/* 第二行：公司信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'white' }}>👤</span>
          <span style={{ fontSize: '14px', color: 'white' }}>{carditem.company}</span>
        </div>

        {/* 第三行：位置信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'white' }}>📍</span>
          <span style={{ fontSize: '14px', color: 'white' }}>{carditem.lacate}</span>
        </div>
      </div>

      {/* 删除按钮 */}
      {touchitem?.id == carditem.id && <div style={{
        // position: 'absolute',
        // right: '-60px',
        // top: '0',
        width: '60px',
        height: '106px',
        paddingTop: '17px',
        paddingRight: '15px',
        paddingBottom: '17px',
        paddingLeft: '15px',
        gap: '10px',
        opacity: 1,
        borderRadius: '20px',
        borderWidth: '0.5px',
        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))',
        border: '0.5px solid #FFFFFF80',
        borderImageSource: 'linear-gradient(124.34deg, rgba(255, 255, 255, 0.135) 29.71%, rgba(255, 255, 255, 0.27) 55.17%, rgba(255, 255, 255, 0.135) 81.42%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        cursor: 'pointer'
      }} onClick={handleDelete}>
        <div style={{ fontSize: '16px', marginBottom: '4px' }}>🗑️</div>
        <div style={{ fontSize: '12px', color: 'white' }}>删除</div>
      </div>}
    </div>
  );
};

export default TaskCard;