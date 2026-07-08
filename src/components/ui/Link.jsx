import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { generateHash } from '../../utils/helpers';

export const Link = ({ view, nav, product, article, page, children, className, onClick, ...props }) => {
    const { navigateTo } = useAppContext();
    
    // Generate the actual URL href
    const href = generateHash({ view, nav, product, article, page });

    const handleClick = (e) => {
        // Let the browser handle Ctrl+Click, Cmd+Click, or middle mouse click natively
        if (e.ctrlKey || e.metaKey || e.button === 1) {
            return;
        }
        
        // For normal clicks, prevent full page reload
        e.preventDefault();
        
        if (onClick) {
            onClick(e);
        }
        
        navigateTo(view, nav, product, article, page);
    };

    return (
        <a href={href} onClick={handleClick} className={className} {...props}>
            {children}
        </a>
    );
};
