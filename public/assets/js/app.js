





const App = function () {


    
    

    
    
    

    
    const transitionsDisabled = function() {
        document.body.classList.add('no-transitions');
    };

    
    const transitionsEnabled = function() {
        document.body.classList.remove('no-transitions');
    };


    
    
    

    
    
    const detectOS = function() {
        const platform = window.navigator.platform,
              windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
              customScrollbarsClass = 'custom-scrollbars';

        
        windowsPlatforms.indexOf(platform) != -1 && document.documentElement.classList.add(customScrollbarsClass);
    };



    
    

    
    
    

    
    const sidebarMainResize = function() {

        
        const sidebarMainElement = document.querySelector('.sidebar-main'),
              sidebarMainToggler = document.querySelectorAll('.sidebar-main-resize'),
              sidebarMobileTogglerClass = 'sidebar-mobile-expanded',
              resizeClass = 'sidebar-main-resized',
              navSubmenuClass = 'nav-group-sub',
              navSubmenuReversedClass = 'nav-group-sub-reversed',
              submenuToggleClass = 'nav-group-sub-visible',
              submenuElement = document.querySelectorAll('.sidebar-main .nav-sidebar > .nav-item-submenu');

        
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        
        if(sidebarMainToggler) {
            sidebarMainToggler.forEach(function(toggler) {
                toggler.addEventListener('click', function(e) {
                    e.preventDefault();
                    sidebarMainElement.classList.toggle(resizeClass);
                    sidebarMainElement.classList.remove(sidebarMobileTogglerClass);
                    !sidebarMainElement.classList.contains(resizeClass) && sidebarMainElement.classList.remove(resizeClass);
                });                
            });
        }

        
        if(submenuElement) {
            submenuElement.forEach(function(toggle) {
                const sub = toggle.querySelector(`:scope > .${navSubmenuClass}`);

                
                toggle.addEventListener('mouseenter', function() {
                    if (sidebarMainElement.classList.contains(resizeClass)) {
                        this.classList.add(submenuToggleClass);
                        this.querySelector(':scope > .nav-link').classList.add('pe-none');
                        !isInViewport(sub) && sub.classList.add(navSubmenuReversedClass);
                    }
                });

                
                toggle.addEventListener('mouseleave', function() {
                    this.classList.remove(submenuToggleClass);
                    this.querySelector(':scope > .nav-link').classList.remove('pe-none');
                    sub.classList.remove(navSubmenuReversedClass);
                });
            });
        }
    };

    
    const sidebarMainToggle = function() {

        
        const sidebarMainElement = document.querySelector('.sidebar-main'),
              sidebarMainRestElements = document.querySelectorAll('.sidebar:not(.sidebar-main)'),
              sidebarMainDesktopToggler = document.querySelectorAll('.sidebar-main-toggle'),
              sidebarMainMobileToggler = document.querySelectorAll('.sidebar-mobile-main-toggle'),
              sidebarCollapsedClass = 'sidebar-collapsed',
              sidebarMobileExpandedClass = 'sidebar-mobile-expanded';

        
        sidebarMainDesktopToggler.forEach(function(toggler) {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarMainElement.classList.toggle(sidebarCollapsedClass);
            });                
        });

        
        sidebarMainMobileToggler.forEach(function(toggler) {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarMainElement.classList.toggle(sidebarMobileExpandedClass);

                sidebarMainRestElements.forEach(function(sidebars) {
                    sidebars.classList.remove(sidebarMobileExpandedClass);
                });
            });                
        });
    };

    
    const sidebarSecondaryToggle = function() {

        
        const sidebarSecondaryElement = document.querySelector('.sidebar-secondary'),
              sidebarSecondaryRestElements = document.querySelectorAll('.sidebar:not(.sidebar-secondary)'),
              sidebarSecondaryDesktopToggler = document.querySelectorAll('.sidebar-secondary-toggle'),
              sidebarSecondaryMobileToggler = document.querySelectorAll('.sidebar-mobile-secondary-toggle'),
              sidebarCollapsedClass = 'sidebar-collapsed',
              sidebarMobileExpandedClass = 'sidebar-mobile-expanded';

        
        sidebarSecondaryDesktopToggler.forEach(function(toggler) {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarSecondaryElement.classList.toggle(sidebarCollapsedClass);
            });                
        });

        
        sidebarSecondaryMobileToggler.forEach(function(toggler) {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarSecondaryElement.classList.toggle(sidebarMobileExpandedClass);

                sidebarSecondaryRestElements.forEach(function(sidebars) {
                    sidebars.classList.remove(sidebarMobileExpandedClass);
                });
            });                
        });
    };

    
    const sidebarRightToggle = function() {

        
        const sidebarRightElement = document.querySelector('.sidebar-end'),
              sidebarRightRestElements = document.querySelectorAll('.sidebar:not(.sidebar-end)'),
              sidebarRightDesktopToggler = document.querySelectorAll('.sidebar-end-toggle'),
              sidebarRightMobileToggler = document.querySelectorAll('.sidebar-mobile-end-toggle'),
              sidebarCollapsedClass = 'sidebar-collapsed',
              sidebarMobileExpandedClass = 'sidebar-mobile-expanded';

        
        sidebarRightDesktopToggler.forEach(function(toggler) {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarRightElement.classList.toggle(sidebarCollapsedClass);
            });                
        });

        
        sidebarRightMobileToggler.forEach(function(toggler) {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarRightElement.classList.toggle(sidebarMobileExpandedClass);

                sidebarRightRestElements.forEach(function(sidebars) {
                    sidebars.classList.remove(sidebarMobileExpandedClass);
                });
            });                
        });
    };

    
    const navigationSidebar = function() {

        
        const navContainerClass = 'nav-sidebar',
              navItemOpenClass = 'nav-item-open',
              navLinkClass = 'nav-link',
              navLinkDisabledClass = 'disabled',
              navSubmenuContainerClass = 'nav-item-submenu',
              navSubmenuClass = 'nav-group-sub',
              navScrollSpyClass = 'nav-scrollspy',
              sidebarNavElement = document.querySelectorAll(`.${navContainerClass}:not(.${navScrollSpyClass})`);

        
        sidebarNavElement.forEach(function(nav) {
            nav.querySelectorAll(`.${navSubmenuContainerClass} > .${navLinkClass}:not(.${navLinkDisabledClass})`).forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const submenuContainer = link.closest(`.${navSubmenuContainerClass}`);
                    const submenu = link.closest(`.${navSubmenuContainerClass}`).querySelector(`:scope > .${navSubmenuClass}`);

                    
                    if(submenuContainer.classList.contains(navItemOpenClass)) {
                        new bootstrap.Collapse(submenu).hide();
                        submenuContainer.classList.remove(navItemOpenClass);
                    }
                    else {
                        new bootstrap.Collapse(submenu).show();
                        submenuContainer.classList.add(navItemOpenClass);
                    }

                    
                    if (link.closest(`.${navContainerClass}`).getAttribute('data-nav-type') == 'accordion') {
                        for (let sibling of link.parentNode.parentNode.children) {
                            if (sibling != link.parentNode && sibling.classList.contains(navItemOpenClass)) {
                                sibling.querySelectorAll(`:scope > .${navSubmenuClass}`).forEach(function(submenu) {
                                    new bootstrap.Collapse(submenu).hide();
                                    sibling.classList.remove(navItemOpenClass);
                                });
                            }
                        }
                    }
                });
            });
        });
    };


    
    

    
    const componentTooltip = function() {
        const tooltipSelector = document.querySelectorAll('[data-bs-popup="tooltip"]');

        tooltipSelector.forEach(function(popup) {
            new bootstrap.Tooltip(popup);
        });
    };

    
    const componentPopover = function() {
        const popoverSelector = document.querySelectorAll('[data-bs-popup="popover"]');

        popoverSelector.forEach(function(popup) {
            new bootstrap.Popover(popup);
        });
    };

    
    const componentToTopButton = function() {

        
        const toTopElement = document.createElement('button'),
              toTopElementIcon = document.createElement('i'),
              toTopButtonContainer = document.createElement('div'),
              toTopButtonColorClass = 'btn-secondary',
              toTopButtonIconClass = 'ph-arrow-up',
              scrollableDistance = 250,
              footerContainer = document.querySelector('.navbar-footer');

        
        document.body.appendChild(toTopButtonContainer);
        toTopButtonContainer.classList.add('btn-to-top');

        
        toTopElement.classList.add('btn', toTopButtonColorClass, 'btn-icon', 'rounded-pill');
        toTopElement.setAttribute('type', 'button');
        toTopButtonContainer.appendChild(toTopElement);
        toTopElementIcon.classList.add(toTopButtonIconClass);
        toTopElement.appendChild(toTopElementIcon);

        
        const to_top_button = document.querySelector('.btn-to-top'),
              add_class_on_scroll = () => to_top_button.classList.add('btn-to-top-visible'),
              remove_class_on_scroll = () => to_top_button.classList.remove('btn-to-top-visible');

        window.addEventListener('scroll', function() { 
            const scrollpos = document.documentElement.scrollTop;
            scrollpos >= scrollableDistance ? add_class_on_scroll() : remove_class_on_scroll();
            if(footerContainer) {
                if (document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight <= footerContainer.clientHeight) {
                    to_top_button.style.bottom = footerContainer.clientHeight + 20 + 'px';
                }
                else {
                    to_top_button.removeAttribute('style');
                }
            }
        });

        
        document.querySelector('.btn-to-top .btn').addEventListener('click', function() {
            document.documentElement.scrollTo(0, 0);
        });
    };


    
    

    
    const cardActionReload = function() {

        
        const buttonClass = '[data-card-action=reload]',
              containerClass = 'card',
              overlayClass = 'card-overlay',
              spinnerClass = 'ph-circle-notch',
              overlayAnimationClass = 'card-overlay-fadeout';

        
        document.querySelectorAll(buttonClass).forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                
                const parentContainer = button.closest(`.${containerClass}`),
                      overlayElement = document.createElement('div'),
                      overlayElementIcon = document.createElement('i');

                
                overlayElement.classList.add(overlayClass);
                parentContainer.appendChild(overlayElement);
                overlayElementIcon.classList.add(spinnerClass, 'spinner', 'text-body');
                overlayElement.appendChild(overlayElementIcon);

                
                setTimeout(function() {
                    overlayElement.classList.add(overlayAnimationClass);
                    ['animationend', 'animationcancel'].forEach(function(e) {
                        overlayElement.addEventListener(e, function() {
                            overlayElement.remove();
                        });
                    });
                }, 2500);
            });
        });
    };

    
    const cardActionCollapse = function() {

        
        const buttonClass = '[data-card-action=collapse]',
              cardCollapsedClass = 'card-collapsed';

        
        document.querySelectorAll(buttonClass).forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                const parentContainer = button.closest('.card'),
                      collapsibleContainer = parentContainer.querySelectorAll(':scope > .collapse');

                if (parentContainer.classList.contains(cardCollapsedClass)) {
                    parentContainer.classList.remove(cardCollapsedClass);
                    collapsibleContainer.forEach(function(toggle) {
                        new bootstrap.Collapse(toggle, {
                            show: true
                        });
                    });
                }
                else {
                    parentContainer.classList.add(cardCollapsedClass);
                    collapsibleContainer.forEach(function(toggle) {
                        new bootstrap.Collapse(toggle, {
                            hide: true
                        });
                    });
                }
            });
        });
    };

    
    const cardActionRemove = function() {

        
        const buttonClass = '[data-card-action=remove]',
              containerClass = 'card'

        
        document.querySelectorAll(buttonClass).forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                button.closest(`.${containerClass}`).remove();
            });
        });
    };

    
    const cardActionFullscreen = function() {

        
        const buttonAttribute = '[data-card-action=fullscreen]',
              buttonClass = 'text-body',
              buttonContainerClass = 'd-inline-flex',
              cardFullscreenClass = 'card-fullscreen',
              collapsedClass = 'collapsed-in-fullscreen',
              fullscreenAttr = 'data-fullscreen';

        
        document.querySelectorAll(buttonAttribute).forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                
                const cardFullscreen = button.closest('.card');

                
                cardFullscreen.classList.toggle(cardFullscreenClass);

                
                if (!cardFullscreen.classList.contains(cardFullscreenClass)) {
                    button.removeAttribute(fullscreenAttr);
                    cardFullscreen.querySelectorAll(`:scope > .${collapsedClass}`).forEach(function(collapsedElement) {
                        collapsedElement.classList.remove('show');
                    });
                    document.body.classList.remove('overflow-hidden');
                    button.closest(`.${buttonContainerClass}`).querySelectorAll(`:scope > .${buttonClass}:not(${buttonAttribute})`).forEach(function(actions) {
                        actions.classList.remove('d-none');
                    });
                }
                else {
                    button.setAttribute(fullscreenAttr, 'active');
                    cardFullscreen.removeAttribute('style');
                    cardFullscreen.querySelectorAll(`:scope > .collapse:not(.show)`).forEach(function(collapsedElement) {
                        collapsedElement.classList.add('show', `.${collapsedClass}`);
                    });
                    document.body.classList.add('overflow-hidden');
                    button.closest(`.${buttonContainerClass}`).querySelectorAll(`:scope > .${buttonClass}:not(${buttonAttribute})`).forEach(function(actions) {
                        actions.classList.add('d-none');
                    });
                }
            });
        });
    };


    
    

    
    const dropdownSubmenu = function() {

        
        const menuClass = 'dropdown-menu',
              submenuClass = 'dropdown-submenu',
              menuToggleClass = 'dropdown-toggle',
              disabledClass = 'disabled',
              showClass = 'show';

        if(submenuClass) {

            
            document.querySelectorAll(`.${menuClass} .${submenuClass}:not(.${disabledClass}) .${menuToggleClass}`).forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    
                    link.closest(`.${submenuClass}`).classList.toggle(showClass);
                    link.closest(`.${submenuClass}`).querySelectorAll(`:scope > .${menuClass}`).forEach(function(children) {
                        children.classList.toggle(showClass);
                    });

                    
                    for (let sibling of link.parentNode.parentNode.children) {
                        if (sibling != link.parentNode) {
                            sibling.classList.remove(showClass);
                            sibling.querySelectorAll(`.${showClass}`).forEach(function(submenu) {
                                submenu.classList.remove(showClass);
                            });
                        }
                    }
                });
            });

            
            document.querySelectorAll(`.${menuClass}`).forEach(function(link) {
                if(!link.parentElement.classList.contains(submenuClass)) {
                    link.parentElement.addEventListener('hidden.bs.dropdown', function(e) {
                        link.querySelectorAll(`.${menuClass}.${showClass}`).forEach(function(children) {
                            children.classList.remove(showClass);
                        });
                    });
                }
            });
        }
    };


    
    
    

    return {

        
        initBeforeLoad: function() {
            detectOS();
            transitionsDisabled();
        },

        
        initAfterLoad: function() {
            transitionsEnabled();
        },

        
        initComponents: function() {
            componentTooltip();
            componentPopover();
            componentToTopButton();
        },

        
        initSidebars: function() {
            sidebarMainResize();
            sidebarMainToggle();
            sidebarSecondaryToggle();
            sidebarRightToggle();
        },

        
        initNavigations: function() {
            navigationSidebar();
        },

        
        initCardActions: function() {
            cardActionReload();
            cardActionCollapse();
            cardActionRemove();
            cardActionFullscreen();
        },

        
        initDropdowns: function() {
            dropdownSubmenu();
        },

        
        initCore: function() {
            App.initBeforeLoad();
            App.initSidebars();
            App.initNavigations();
            App.initComponents();
            App.initCardActions();
            App.initDropdowns();
        }
    };
}();






document.addEventListener('DOMContentLoaded', function() {
    App.initCore();
});


window.addEventListener('load', function() {
    App.initAfterLoad();
});
