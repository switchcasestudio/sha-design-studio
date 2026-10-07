import { Children, cloneElement, isValidElement, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useTheme } from '@/theme/ThemeContext';
import SplitText from '../SplitText';
import './home.css';

// Splits plain-string children into rising words; an `.hl` span keeps its
// block but its words rise a beat later, after the block has wiped in.
function splitChildren(children, trigger) {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      return <SplitText text={child} trigger={trigger} />;
    }
    if (
      isValidElement(child) &&
      typeof child.props.children === 'string' &&
      String(child.props.className ?? '').includes('hl')
    ) {
      return cloneElement(child, {
        children: <SplitText text={child.props.children} trigger={trigger} delay={0.35} />,
      });
    }
    return child;
  });
}

/* Vivid-only headline: words rise out of their line, then the .hl block wipes
   in from the left like a marker stroke. Regular: a plain heading, untouched.
     <WipeHeading as="h2" className="x">What I <span className="hl">do</span></WipeHeading>
   `trigger="mount"` plays on load (hero) instead of on scroll-in. */
function WipeHeading({ as = 'h2', className, trigger = 'view', children, ...props }) {
  const { isVivid } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const Tag = as;

  if (!isVivid) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] ?? motion.h2;
  const shown = trigger === 'mount' || inView;
  return (
    <MotionTag
      ref={ref}
      className={className}
      data-hl-wipe={shown ? 'in' : 'out'}
      {...props}
    >
      {splitChildren(children, trigger)}
    </MotionTag>
  );
}

export default WipeHeading;
