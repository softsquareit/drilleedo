





const FullCalendarBasic = function() {


    
    
    

    
    const _componentFullCalendarBasic = function() {
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


        
        

        
        
        

        
        const calendarBasicViewElement = document.querySelector('.fullcalendar-basic');

        
        if(calendarBasicViewElement) {
            const calendarBasicViewInit = new FullCalendar.Calendar(calendarBasicViewElement, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                initialDate: '2020-09-12',
                navLinks: true, 
                nowIndicator: true,
                weekNumberCalculation: 'ISO',
                editable: true,
                selectable: true,
                direction: document.dir == 'rtl' ? 'rtl' : 'ltr',
                dayMaxEvents: true, 
                events: events
            });

            
            calendarBasicViewInit.render();

            
            document.querySelectorAll('.sidebar-control').forEach(function(sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    calendarBasicViewInit.updateSize();
                });
            });
        }


        
        
        

        
        const calendarAgendaViewElement = document.querySelector('.fullcalendar-agenda');

        
        if(calendarAgendaViewElement) {
            const calendarAgendaViewInit = new FullCalendar.Calendar(calendarAgendaViewElement, {
                initialDate: '2020-09-12',
                initialView: 'timeGridWeek',
                nowIndicator: true,
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                },
                navLinks: true, 
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true, 
                direction: document.dir == 'rtl' ? 'rtl' : 'ltr',
                events: events
            });

            
            calendarAgendaViewInit.render();

            
            document.querySelectorAll('.sidebar-control').forEach(function(sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    calendarAgendaViewInit.updateSize();
                });
            });
        }


        
        
        

        
        const calendarListViewElement = document.querySelector('.fullcalendar-list');

        
        if(calendarListViewElement) {
            const calendarListViewInit = new FullCalendar.Calendar(calendarListViewElement, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'listDay,listWeek,listMonth'
                },

                
                
                views: {
                    listDay: {
                        buttonText: 'Day'
                    },
                    listWeek: {
                        buttonText: 'Week'
                    },
                    listMonth: {
                        buttonText: 'Month'
                    }
                },
                initialView: 'listWeek',
                initialDate: '2020-09-12',
                navLinks: true, 
                editable: true,
                height: 'auto',
                dayMaxEvents: true, 
                direction: document.dir == 'rtl' ? 'rtl' : 'ltr',
                events: events
            });

            
            calendarListViewInit.render();

            
            document.querySelectorAll('.sidebar-control').forEach(function(sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    calendarListViewInit.updateSize();
                });
            });
        }
    };


    
    
    

    return {
        init: function() {
            _componentFullCalendarBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FullCalendarBasic.init();
});
