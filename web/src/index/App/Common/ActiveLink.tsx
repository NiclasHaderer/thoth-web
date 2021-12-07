import React, { AnchorHTMLAttributes } from 'react';
import { Link, useRoute } from 'wouter';


export const ActiveLink: React.FC<{ href: string, withSubroutes?: boolean }> = ({href, children, withSubroutes}) => {
  const [isSubRoute] = useRoute(`${href}/:id`);
  const [isRoute] = useRoute(href);

  const isActive = withSubroutes ? isSubRoute || isRoute : isRoute;
  return (
    <Link href={href}>
      <a href={href} className={`cursor-pointer group ${isActive ? 'text-primary' : ''}`}>{children}</a>
    </Link>
  );
};

interface ALinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}


export const ALink: React.FC<ALinkProps> = ({href, children, className, ...props}) => {
  return <Link href={href}>
    <a href={href} className={`group ${className || ''}`} {...props}>
      {children}
    </a>
  </Link>;
};
