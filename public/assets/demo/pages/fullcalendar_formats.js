





const FullCalendarFormats = function() {


    
    
    

    
    const _componentFullCalendarFormats = function() {
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

        
        
        

        
        const calendarFormatElement = document.querySelector('.fullcalendar-formats');

        
        if(calendarFormatElement) {
            const calendarFormatInit = new FullCalendar.Calendar(calendarFormatElement, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                },
                titleFormat: {
                    dayGridMonth: {
                        titleFormat: {
                            year: 'numeric',
                            month: 'long',
                            weekday: 'long'
                        }
                    },
                    dayGridWeek: {
                        titleFormat: {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            weekday: 'short'
                        }
                    },
                    dayGridDay: {
                        titleFormat: {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short'
                        }
                    }
                },
                eventTimeFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                },
                initialDate: '2020-09-12',
                navLinks: true, 
                businessHours: true, 
                editable: true,
                selectable: true,
                editable: true,
                direction: document.dir == 'rtl' ? 'rtl' : 'ltr',
                events: events
            });

            
            calendarFormatInit.render();

            
            document.querySelectorAll('.sidebar-control').forEach(function(sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    calendarFormatInit.updateSize();
                })
            });
        }


        
        
        

        
        const initialLocaleCode = 'en';

        
        const calendarLocaleSelectorElement = document.getElementById('lang-selector');
        const calendarLocaleElement = document.querySelector('.fullcalendar-languages');

        
        if(calendarLocaleElement) {
            const calendarLocaleInit = new FullCalendar.Calendar(calendarLocaleElement, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                },
                locale: initialLocaleCode,
                buttonIcons: false, 
                weekNumbers: true,
                editable: true,
                direction: document.dir == 'rtl' ? 'rtl' : 'ltr',
                events: events
            });

            
            calendarLocaleInit.render();

            
            document.querySelectorAll('.sidebar-control').forEach(function(sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    calendarEventColorsInit.updateSize();
                })
            });


            
            calendarLocaleInit.getAvailableLocaleCodes().forEach(function(localeCode) {
                const optionEl = document.createElement('option');
                optionEl.value = localeCode;
                optionEl.selected = localeCode == initialLocaleCode;
                optionEl.innerText = localeCode;
                calendarLocaleSelectorElement.appendChild(optionEl);
            });

            
            calendarLocaleSelectorElement.addEventListener('change', function (e) { 
                if (this.value) {
                    calendarLocaleInit.setOption('locale', this.value);
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _componentFullCalendarFormats();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FullCalendarFormats.init();
});
