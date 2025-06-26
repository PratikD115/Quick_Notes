import React, { ReactNode, useEffect, useRef, useState } from "react";
import { func, node } from "prop-types";

interface ClickOutsideProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClickOutside: (e: Event) => void;
}

const ClickOutside: React.FC<ClickOutsideProps> = ({
  children,
  onClickOutside,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handle = (e : Event) => {
      if (e.type === "touchend") {
        setIsTouch(true);
        return;
      }

      if (e.type === "click" && isTouch) return;

      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClickOutside(e);
      }
    };

    document.addEventListener("touchend", handle, true);
    document.addEventListener("click", handle, true);

    return () => {
      document.removeEventListener("touchend", handle, true);
      document.removeEventListener("click", handle, true);
    };
  }, [isTouch, onClickOutside]);

  return (
    <div
      {...props}
      ref={containerRef}
      style={{ display: "contents", ...(props.style ? props.style : {}) }}
    >
      {children}
    </div>
  );
};

ClickOutside.propTypes = {
  children: node,
  onClickOutside: func.isRequired,
};

export default ClickOutside;
