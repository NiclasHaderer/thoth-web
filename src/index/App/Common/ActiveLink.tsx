import React, { MouseEventHandler } from 'react';
import { Link, useRoute } from 'wouter';


export const ActiveLink: React.FC<{ href: string, withSubroutes?: boolean }> = ({href, children, withSubroutes}) => {
  const [isSubRoute] = useRoute(`${href}/:id`);
  const [isRoute] = useRoute(href);

  const isActive = withSubroutes ? isSubRoute || isRoute : isRoute;
  return (
    <Link href={href}>
      <a href={href} className={`cursor-pointer ${isActive ? 'text-primary' : ''}`}>{children}</a>
    </Link>
  );
};


export const ALink: React.FC<{ href: string, onClick?: MouseEventHandler<HTMLAnchorElement>, className?: string, label?: string  }> = ({href, children, onClick, className, label}) => {
  return <Link href={href} onClick={onClick}>
    <a href={href} className={className} aria-label={label}>
      {children}
    </a>
  </Link>;
};