

const COLLISION_THRESHOLD = 150;
const PUSH_DISTANCE = 100;
const ANIMATION_DURATION = 500;

export const checkCollision = (pos1, pos2) => {
    return (
      Math.abs(pos1.x - pos2.x) < COLLISION_THRESHOLD &&
      Math.abs(pos1.y - pos2.y) < COLLISION_THRESHOLD
    );
  };

  export const calculatePushPosition = (focusPos, otherPos) => {
    const dx = otherPos.x - focusPos.x;
    const dy = otherPos.y - focusPos.y;

    return {
      x: otherPos.x + (Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? PUSH_DISTANCE : -PUSH_DISTANCE) : 0),
      y: otherPos.y + (Math.abs(dy) >= Math.abs(dx) ? (dy > 0 ? PUSH_DISTANCE : -PUSH_DISTANCE) : 0),
    };
  };

  export const animateNodePosition = (node, targetPosition, setNodes) => {
    const start = { ...node.position };
    const distanceX = targetPosition.x - start.x;
    const distanceY = targetPosition.y - start.y;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

      const newX = start.x + distanceX * progress;
      const newY = start.y + distanceY * progress;

      setNodes((nds) =>
        nds.map((nd) =>
          nd.id === node.id ? { ...nd, position: { x: newX, y: newY } } : nd
        )
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };