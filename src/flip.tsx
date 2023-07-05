import React, { ReactElement } from "react";

export interface FlipProps {
  children: React.ReactElement;
  duration?: EffectTiming["duration"];
  easing?: EffectTiming["easing"];
}

export class GetSnapshotBeforeUpdate extends React.Component<{
  callback?: VoidFunction;
}> {
  getSnapshotBeforeUpdate = () => {
    this.props.callback?.();
    return null;
  };

  componentDidUpdate = () => {};

  render = () => null;
}

export default function Flip({
  children,
  duration = 300,
  easing = "ease"
}: FlipProps) {
  const dom = React.useRef<HTMLElement>();
  const prevDom = React.useRef<HTMLElement>();
  const rectBeforeUpdate = React.useRef<DOMRect>();

  React.useLayoutEffect(() => {
    const el = dom.current;
    prevDom.current = el;
    const prevRect = rectBeforeUpdate.current;
    if (!el || !prevRect) return;
    const rect = el.getBoundingClientRect();
    const animation = el.animate(
      [
        {
          transform: `translate(${prevRect.x - rect.x}px, ${
            prevRect.y - rect.y
          }px) scale(${prevRect.width / rect.width}, ${
            prevRect.height / rect.height
          })`
        },
        { transform: `translate(0, 0) scale(1, 1)` }
      ],
      { duration, easing }
    );
    return () => animation.cancel();
  });

  const child = React.Children.only(children);
  if (!React.isValidElement(child)) return null;

  return (
    <>
      <GetSnapshotBeforeUpdate
        callback={() => {
          rectBeforeUpdate.current = dom.current?.getBoundingClientRect();
          return null;
        }}
      />
      {React.cloneElement(
        child as ReactElement<{ ref: (node: HTMLElement) => void }>,
        {
          ref: (node: HTMLElement) => {
            if (!node) {
              return;
            }
            dom.current = node;
            const { ref } = child as any;
            if (typeof ref === "function") ref(node);
          }
        }
      )}
    </>
  );
}
