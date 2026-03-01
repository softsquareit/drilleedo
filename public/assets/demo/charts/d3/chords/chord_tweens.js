





var D3ChordTweens = function() {


    
    
    

    
    var _chordTweens = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-chord-tweens');


        
        if(element) {

            
            

            
            var data = [
                [6,32,47,81,31,89,24,68,50,39],
                [37,83,57,80,87,7,85,7,68,17],
                [50,15,31,3,1,85,36,95,83,99],
                [77,2,87,41,93,52,6,42,11,76],
                [91,56,97,65,23,60,63,68,45,48],
                [97,50,79,52,85,31,85,21,79,44],
                [17,77,96,22,87,98,58,15,36,16],
                [44,54,60,69,36,44,76,58,50,16]
            ];



            
            

            d3.chart = d3.chart || {};

            d3.chart.chord = function(container) {

                
                var self = {},
                    svg;

                
                var w = 400,
                    h = 400,
                    r0 = Math.min(w, h) * .37,
                    r1 = r0 * 1.1;

                
                var fill = d3.scale.category20();


                
                

                
                var chord = d3.layout.chord()
                    .padding(.05)
                    .sortSubgroups(d3.descending);

                
                var arc_svg = d3.svg.arc()
                    .innerRadius(r0)
                    .outerRadius(r1);

                
                var chord_svg = d3.svg.chord().radius(r0);



                
                

                
                self.update = function(data) {
                   if (!chord.matrix()) {
                       chord.matrix(data);
                       self.render();
                   } else {
                       var old = {
                           groups: chord.groups(),
                           chords: chord.chords()
                       };
                       chord.matrix(data);
                       self.transition(old);
                   }
                };

                
                self.clear = function() {
                    d3.select(container).selectAll('svg').remove();
                };

                
                self.transition = function(old) {

                    
                    svg.selectAll(".d3-chord-ticks")
                        .transition()
                            .duration(200)
                            .attr("opacity", 0);

                    
                    svg.selectAll(".d3-arc")
                        .data(chord.groups)
                        .transition()
                            .duration(1500)
                            .attrTween("d", arcTween(arc_svg, old));

                    
                    svg.selectAll(".d3-chord")
                        .selectAll("path")
                        .data(chord.chords)
                        .transition()
                            .duration(1500)
                            .attrTween("d", chordTween(chord_svg, old));

                    setTimeout(self.drawTicks, 1100);
                };

                
                self.render = function() {
                    self.clear();

                    
                    svg = d3.select(container).append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .append("g")
                            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

                    
                    svg.append("g")
                        .selectAll(".d3-arc")
                        .data(chord.groups)
                        .enter()
                        .append("path")
                            .attr("class", "d3-arc")
                            .attr("d", arc_svg)
                            .style("fill", function(d) { return fill(d.index); })
                            .style("stroke", function(d) { return fill(d.index); })
                            .on("mouseover", fade(.1, svg))
                            .on("mouseout", fade(1, svg));

                    
                    svg.append("g")
                        .attr("class", "d3-chord")
                        .selectAll("path")
                        .data(chord.chords)
                        .enter()
                        .append("path")
                            .style("fill", function(d) { return fill(d.target.index); })
                            .attr("d", chord_svg)
                            .attr("class", "d3-slice-border")
                            .style("stroke-width", 1)
                            .style("fill-opacity", 0.7)

                    
                    self.drawTicks();
                };

                
                self.drawTicks = function() {

                    
                    svg.selectAll(".d3-chord-ticks").remove();

                    
                    var ticks = svg.append("g")
                        .attr("class", "d3-chord-ticks d3-axis")
                        .attr("opacity", 0.1)
                        .selectAll("g")
                        .data(chord.groups)
                        .enter()
                        .append("g")
                            .selectAll("g")
                            .data(groupTicks)
                            .enter()
                            .append("g")
                                .attr("transform", function(d) {
                                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                                    + "translate(" + r1 + ",0)";
                                });

                    
                    ticks.append("line")
                        .attr("x1", 1)
                        .attr("y1", 0)
                        .attr("x2", 5)
                        .attr("y2", 0);

                    
                    ticks.append("text")
                        .attr("class", "d3-text")
                        .attr("x", 8)
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) {
                            return d.angle > Math.PI ? "end" : null;
                        })
                        .attr("transform", function(d) {
                            return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
                        })
                        .style("font-size", 12)
                        .text(function(d) { return d.label; });

                    
                    svg.selectAll(".d3-chord-ticks").transition()
                        .duration(340)
                        .attr("opacity", 1);
                };

                return self;
            };



            

            
            function groupTicks(d) {
                var k = (d.endAngle - d.startAngle) / d.value;
                return d3.range(0, d.value, 50).map(function(v, i) {
                    return {
                        angle: v * k + d.startAngle,
                        label: i % 2 ? null : v
                    };
                });
            }

            
            function fade(opacity, svg) {
              return function(g, i) {
                svg.selectAll(".d3-chord path")
                    .filter(function(d) {
                        return d.source.index != i && d.target.index != i;
                    })
                    .transition()
                    .style("opacity", opacity);
              };
            }

            
            function arcTween(arc_svg, old) {
                return function(d,i) {
                    var i = d3.interpolate(old.groups[i], d);
                    return function(t) {
                        return arc_svg(i(t));
                    }
                }
            }

            
            function chordTween(chord_svg, old) {
                return function(d,i) {
                    var i = d3.interpolate(old.chords[i], d);
                    return function(t) {
                        return chord_svg(i(t));
                    }
                }
            }

            
            function random_matrix(size) {
                var matrix = [];
                for (var i=0; i<size; i++) {
                    var row = [];
                    for (var j=0; j<size; j++) {
                        var num = Math.round(100*Math.pow(Math.random(),2)+1);
                        row.push(num);
                    }
                    matrix.push(row);
                }
                return matrix;
            };



            
            

            initChord();

            function initChord() {
                var chord = d3.chart.chord(element);
                chord.update(data);

                d3.select("#update-tween").on("click", function() {
                    var data = random_matrix(8);
                    chord.update(data);
                });
                d3.select("#clear-tween").on("click", function() {
                    chord.clear();
                });
                d3.select("#render-tween").on("click", function() {
                    chord.render();
                });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _chordTweens();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3ChordTweens.init();
});
