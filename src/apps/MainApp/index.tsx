import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import * as d3 from 'd3';
import _ from "lodash";

import colors from "theme/grid-item-colors";
import Legends from 'components/Legends';
import { IGridItem } from 'apps/BaseApp/interfaces/IGridItem';

import { algorithm } from "./algorithms/astar/astar";
import { updateGridWithNeighbors } from 'apps/MainApp/helpers/update-grid-with-neighbors';
import Actions from './components/Actions';

const AppContainer = styled.div` 
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
    flex-wrap: wrap;
`;

const WIDTH = 800;
const HEIGHT = 800;
const square = 20;
const squaresRow = _.round(WIDTH / square);
const squaresColumn = _.round(HEIGHT / square);

export default function MainApp() {
    const [speed, setSpeed] = useState("fast");

    const draw = () => {
        // create the svg
        d3.select("#grid").selectAll("*").remove();
        const svg = d3.select('#grid').append('svg').attr("width", WIDTH).attr("height", HEIGHT)
        const Tooltip = d3.select('#grid')
            .append("div")
            .style("opacity", 1)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "fixed")

        // loop over number of columns
        _.times(squaresColumn, function (n) {

            // create each set of rows
            const rows = svg.selectAll('rect' + ' .row-' + (n + 1))
                .data(d3.range(squaresRow).map((r => {
                    return {
                        x: r,
                        y: n
                    }
                })))
                .enter().append('rect')
                .attr("class", function (d, i) {
                    return 'square row-' + (n + 1) + ' ' + 'col-' + (i + 1);
                })
                .attr("id", function (d, i) {
                    return 's-' + (n + 1) + (i + 1);
                })
                .attr("width", square)
                .attr("height", square)
                .attr("x", function (d, i) {
                    return i * square;
                })
                .attr("y", n * square)
                .attr("fill", "#fff")
                .attr("stroke", "#ccc")

            // svg.select(".square.row-2.col-2").attr("fill", "blue")
            // svg.select(".square.row-4.col-12").attr("fill", "green")

            rows.on('click', function (d, i) {
                const startIsEmpty = d3.select(".square[start='true']").empty();
                if (startIsEmpty) {
                    d3.select(this).attr('fill', colors.START).attr('start', 'true')
                    return;
                }
                const endIsEmpty = d3.select(".square[end='true']").empty();
                if (endIsEmpty) {
                    d3.select(this).attr('fill', colors.END).attr('end', 'true')
                    return;
                }
                d3.select(this).attr('fill', colors.BARRIER)
            })

            svg.on('mousedown', function (d, i) {
                console.log(`mousedown on ${JSON.stringify(i)}`)
                d3.selectAll(".square").on('mouseover', function (d, i) {
                    const startIsEmpty = d3.select(".square[start='true']").empty();
                    if (startIsEmpty) {
                        // d3.select(this).attr('fill', colors.START).attr('start', 'true')
                        return;
                    }
                    const endIsEmpty = d3.select(".square[end='true']").empty();
                    if (endIsEmpty) {
                        // d3.select(this).attr('fill', colors.END).attr('end', 'true')
                        return;
                    }
                    d3.select(this).attr('fill', colors.BARRIER)
                })
            })

            svg.on('mouseup', function (d, i) {
                console.log(`mouseup on ${JSON.stringify(i)}`)
                d3.selectAll(".square").on('mouseover', null)
            })

            // rows.on('mouseover', function (event, d) {
            //     Tooltip.style("opacity", 1)
            // })

            // rows.on('mousemove', function (event, d) {
            //     Tooltip
            //         .html(`X: ${d.x}, Y: ${d.y}`)
            //         .style("left", (event.x) + "px")
            //         .style("top", (event.y) + "px")
            // })

            // rows.on('mouseleave', function (d) {
            //     Tooltip.style("opacity", 0)
            // })

            // test with some feedback
            rows.on('mouseover', function (d, i) {
                d3.select('#grid-ref').text(function () {
                    return `row: ${n + 1}  | column: ${i.x + 1}`
                });
            });
        });
    }

    const reset = () => {
        draw();
    }

    // Fake visualize path
    const visualizeFake = () => {
        const elements = d3.select('#grid').selectAll(".square")
        // console.log(elements.data())
        elements.filter(function (d: any, i: any) {
            if (d.x === 2 && d.y === 1) {
                return true;
            }
            if (d.x === 3 && d.y === 1) {
                return true;
            }
            if (d.x === 3 && d.y === 1) {
                return true;
            }
            if (d.x === 4 && d.y === 1) {
                return true;
            }
            if (d.x === 5 && d.y === 1) {
                return true;
            }
            if (d.x === 6 && d.y === 1) {
                return true;
            }
            if (d.x === 7 && d.y === 1) {
                return true;
            }
            if (d.x === 8 && d.y === 1) {
                return true;
            }
            if (d.x === 9 && d.y === 1) {
                return true;
            }
            if (d.x === 10 && d.y === 1) {
                return true;
            }
            if (d.x === 11 && d.y === 1) {
                return true;
            }
            if (d.x === 11 && d.y === 2) {
                return true;
            }
            return false;
        }).transition().duration(1000).attr("fill", "red").delay(function (_this, i) {
            return i * 50;
        })

        // elements.transition().duration(500).attr("fill", "red").delay(function (_this, i) {
        //     return i * 10;
        // })
    }

    const drawGridItem = (gridItem: IGridItem) => {
        const { x, y } = gridItem;
        const query = `.square[x='${x * square}'][y='${y * square}']`;
        const el = d3.select('#grid').select(query);
        el.attr("fill", gridItem.color);
    }

    const findPath = () => {
        const colorsToClear = [
            colors.PATH,
            colors.CLOSED,
            colors.OPEN
        ]
        d3.selectAll('.square').filter(function (d) {
            return colorsToClear.includes(d3.select(this).attr('fill'))
        }).attr('fill', colors.BLANK)


        const grid: Array<Array<IGridItem>> = [];
        d3.selectAll('.square').each(function (d) {
            const el = d3.select(this);
            const x = parseInt(el.attr("x") || "") / square;
            const y = parseInt(el.attr("y") || "") / square;
            const newGridItem: IGridItem = {
                color: el.attr("fill"),
                gCost: Infinity,
                fCost: Infinity,
                hCost: Infinity,
                id: `x${x}-y${y}`,
                x: x,
                y: y,
                neighbors: []
            }
            if (grid.length <= y) {
                grid.push([]);
            }
            grid[y].push(newGridItem)
        });
        const gridWithNeighbors = updateGridWithNeighbors(grid, squaresRow, squaresColumn);
        const startNode = d3.select(".square[start='true']");
        const endNode = d3.select(".square[end='true']");
        const startGridItem = gridWithNeighbors[parseInt(startNode.attr("y")) / square][parseInt(startNode.attr("x")) / square]
        const endGridItem = gridWithNeighbors[parseInt(endNode.attr("y")) / square][parseInt(endNode.attr("x")) / square]

        const pathFound = algorithm(redraw, gridWithNeighbors, startGridItem, endGridItem, speed, drawGridItem)
        console.log(`Path found: ${pathFound}`)
    }

    const redraw = (grid: Array<Array<IGridItem>>) => {
        const elements = d3.select('#grid').selectAll(".square").filter(function (d: any, i: any) {
            const currentFill = d3.select(this).attr("fill");
            return currentFill !== colors.BARRIER && d.color !== colors.CLOSED;
        });
        const flatGrid = _.flattenDeep(grid);
        const colorsToFind = [
            colors.CLOSED,
            colors.OPEN,
            colors.START,
            colors.END
        ];
        const toUpdate = flatGrid.filter((gi) => {
            return colorsToFind.includes(gi.color);
        });

        toUpdate.forEach((tu) => {
            const { x, y, color } = tu;
            const el = elements.filter(function (d: any, i: any) {
                return d.x === x && d.y === y;
            });
            if (el.empty()) {
                return;
            }
            const currentColor = el.attr("fill");
            if (currentColor !== color) {
                el.attr("fill", color);
            }
        })
    }

    useEffect(() => {
        draw();
    }, [])

    return (
        <AppContainer>
            <div>
                <Actions findPath={findPath} reset={reset} speed={speed} setSpeed={setSpeed} />
                <Legends />
                <div id="grid" />
                <div id="grid-ref" />

            </div>
        </AppContainer>
    )
}
