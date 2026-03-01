





const FullCalendarAdvanced = function() {


    
    
    

    
    const _componentFullCalendarEvents = function() {
        if (typeof FullCalendar == 'undefined') {
            console.warn('Warning - Fullcalendar is not loaded.');
            return;
        }


        
        

        
        const events = [
            {
                title: 'All Day Event',
                start: '2020-09-01'
            },
            {
                title: 'Long Event',
                start: '2020-09-07',
                end: '2020-09-10'
            },
            {
                groupId: 999,
                title: 'Repeating Event',
                start: '2020-09-09T16:00:00'
            },
            {
                groupId: 999,
                title: 'Repeating Event',
                start: '2020-09-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2020-09-11',
                end: '2020-09-13'
            },
            {
                title: 'Meeting',
                start: '2020-09-12T10:30:00',
                end: '2020-09-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2020-09-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2020-09-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: '2020-09-12T17:30:00'
            },
            {
                title: 'Dinner',
                start: '2020-09-12T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2020-09-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2020-09-28'
            }
        ];


        
        
        

        
        const calendarEventsContainerElement = document.getElementById('external-events-list');
        const calendarEventsElement = document.querySelector('.fullcalendar-external');
        const checkboxElement = document.getElementById('drop-remove');

        
        if(calendarEventsElement) {

            
            const eventColors = calendarEventsContainerElement.querySelectorAll('.fc-event');
            eventColors.forEach(function(element) {
                element.style.borderColor = element.getAttribute('data-color');
                element.style.backgroundColor = element.getAttribute('data-color');
            });

            
            new FullCalendar.Draggable(calendarEventsContainerElement, {
                itemSelector: '.fc-event',
                eventData: function(eventEl) {
                    return {
                        title: eventEl.innerText.trim(),
                        backgroundColor: eventEl.getAttribute('data-color'),
                        borderColor: eventEl.getAttribute('data-color')
                    }
                }
            });

            
            const calendarEventsInit = new FullCalendar.Calendar(calendarEventsElement, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                editable: true,
                droppable: true, 
                initialDate: '2020-09-12',
                direction: document.dir == 'rtl' ? 'rtl' : 'ltr',
                events: events,
                drop: function(arg) {
                    if (checkboxElement.checked) {
                        arg.draggedEl.parentNode.removeChild(arg.draggedEl);
                    }
                }
            });

            
            calendarEventsInit.render();

            
            document.querySelectorAll('.sidebar-control').forEach(function(sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    calendarEventsInit.updateSize();
                })
            });
        }
    };

    
    const _componentFullCalendarSelectable = function() {
        if (typeof FullCalendar == 'undefined') {
            console.warn('Warning - Fullcalendar files are not loaded.');
            return;
        }


        
        

        
        const events = [
            {
                title: 'All Day Event',
                start: '2020-09-01'
            },
            {
                title: 'Long Event',
                start: '2020-09-07',
                end: '2020-09-10'
            },
            {
                groupId: 999,
                title: 'Repeating Event',
                start: '2020-09-09T16:00:00'
            },
            {
                groupId: 999,
                title: 'Repeating Event',
                start: '2020-09-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2020-09-11',
                end: '2020-09-13'
            },
            {
                title: 'Meeting',
                start: '2020-09-12T10:30:00',
                end: '2020-09-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2020-09-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2020-09-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: '2020-09-12T17:30:00'
            },
            {
                title: 'Dinner',
                start: '2020-09-12T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2020-09-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2020-09-28'
            }
        ];


        
        
        

        
        const calendarSelectableElement = document.querySelector('.fullcalendar-selectable');

        
        if(calendarSelectableElement) {
            const calendarSelectableInit = new FullCalendar.Calendar(calendarSelectableElement, {
                headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                initialDate: '2020-09-12',
                navLinks: true, 
                selectable: true,
                selectMirror: true,
                events: events,
                select: function(arg) {
                    const title = prompt('Event Title:');
                    if (title) {
                        calendarSelectableInit.addEvent({
                            title: title,
                            start: arg.start,
                            end: arg.end,
                            allDay: arg.allDay
                        });
                    }
                    calendarSelectableInit.unselect();
                },
                eventClick: function(arg) {
                    if (confirm('Are you sure you want to delete this event?')) {
                        arg.event.remove();
                    }
                },
                editable: true,
                direction: document.dir == 'rtl' ? 'rtl' : 'ltr',
                dayMaxEvents: true 
            });

            
            calendarSelectableInit.render();

            
            document.querySelectorAll('.sidebar-control').forEach(function(sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    calendarSelectableInit.updateSize();
                })
            });
        }
    };


    
    
    

    return {
        init: function() {
            _componentFullCalendarEvents();
            _componentFullCalendarSelectable();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FullCalendarAdvanced.init();
});
