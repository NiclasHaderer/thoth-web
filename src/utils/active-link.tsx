import React, { PropsWithChildren } from 'react';
import { Link, LinkProps, useRoute } from 'wouter';


export const ActiveLink = (props: PropsWithChildren<LinkProps>) => {
  const [isActive] = useRoute(props.href!);
  return (
    <Link {...props}>
      <a className={isActive ? 'bg-blue-100 block' : 'block'}>{props.children}</a>
    </Link>
  );
};
