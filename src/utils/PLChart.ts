import * as d3 from "d3";

interface PlPointsItem {
  price: number;
  pl: number
}

interface Data {
  minPrice: number;
  maxPrice: number;
  minPL: number;
  maxPL: number;
  breakeven: number;
  maxLossPrice: number;
  maxProfitPrice: number;
  maxLoss: number;
  maxProfit: number;
  plPoints: PlPointsItem[];
}

export const data: Data = {
  minPrice: 200,
  maxPrice: 300,
  minPL: -300,
  maxPL: 300,
  breakeven: 250,
  maxLossPrice: 249,
  maxProfitPrice: 300,
  maxLoss: -50,
  maxProfit: 300,
  plPoints: Array.from({length: 101}, (_, i) => {
    const price = 200 + i;
    return {
      price,
      pl: price < 250 ? -50 : (price - 250) * 6
    };
  })
};

const createPLChart = (container: HTMLDivElement, data: Data) => {
  // 设置图表尺寸和边距
  const margin = {top: 100, right: 80, bottom: 50, left: 180};
  const width = 1000 - margin.left - margin.right;
  const height = 580 - margin.top - margin.bottom;

  // 创建SVG容器
  const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 创建比例尺
  const x = d3.scaleLinear()
    .domain([data.minPrice, data.maxPrice])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([data.minPL, data.maxPL])
    .range([height, 0]);

  // 添加网格线
  const grid = svg.append("g");
  grid.append('line')
    .attr('x1', -100)
    .attr('y1', 0)
    .attr('x2', width)
    .attr('y2', 0)
    .style("stroke-dasharray", "2,5")
    .style('stroke', '#000');
  grid.append('line')
    .attr('x1', -100)
    .attr('y1', height)
    .attr('x2', width)
    .attr('y2', height)
    .style("stroke-dasharray", "2,5")
    .style('stroke', '#000');


  const leftText = svg.append("g");
  leftText.append('text')
    .attr('x', -80)
    .attr('y', 180)
    .text('+')
    .style('font-size', '20px')
    .style('color', '#000');
  leftText.append('text')
    .attr('x', -80)
    .attr('y', height / 2 + 10)
    .text('0')
    .style('font-size', '20px')
    .style('color', '#000');
  leftText.append('text')
    .attr('x', -80)
    .attr('y', height / 2 + 50)
    .text('-')
    .style('font-size', '20px')
    .style('color', '#000');

  // 添加P/L区域
  const area = d3.area()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .x(d => x(d.price))
    .y0(y(0))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .y1(d => y(d.pl));

  svg.append('path')
    .attr('fill', 'rgba(255,106,0,0.3)')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .attr('d', area(data.plPoints.filter((d) => d.pl <= 0)));
  svg.append('path')
    .attr('fill', 'rgba(4,227,48,0.3)')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .attr('d', area(data.plPoints.filter((d) => d.pl > 0)));

  // 绘制P/L线
  const line = d3.line()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .x(d => x(d.price)).y(d => y(d.pl));

  svg.append("path")
    .datum(data.plPoints)
    .attr("class", "pl-line")
    .attr("fill", "none")
    .attr("stroke", "#04e330")
    .attr("stroke-width", 2)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .attr("d", line);

  const defLine = svg.append("g");
  defLine.append('line')
    .attr('class', 'def-line')
    .attr('x1', x(275))
    .attr('y1', 0)
    .attr('x2', x(275))
    .attr('y2', height)
    .style('stroke-width', 1.5)
    .style('stroke', '#cccccc');

  // 添加关键点
  const keyPoints = [
    {x: data.breakeven, y: 0, label: "Breakeven", color: "#000"},
    {x: data.maxLossPrice, y: data.maxLoss, label: "Max Loss", color: "#ff6a00"},
    {x: data.maxProfitPrice, y: data.maxProfit, label: "Max Profit", color: "#04e330"}
  ];

  // 添加标题
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 1.3)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("fill", "#858585")
    .text("Expected Profit & Loss");

  // 添加交互效果
  const focus = svg.append("g");
  focus.append("text")
    .text(`MEOW Price at Exp`)
    .attr('class', 'focus-title')
    .style("font-size", "28px")
    .style("fill", "#858585")
    .attr("x", x(275) - 124)
    .attr("dy", -40);
  focus.append("text")
    .text(`$275`)
    .attr('class', 'focus-value')
    .style("font-size", "24px")
    .attr("x", x(275) - 27)
    .attr("dy", -12);

  const focusCircle = svg.append("g")
    .attr('class', 'focus-circle')
    .attr('transform', `translate(0, ${height / 2})`)
    .style("display", "none");
  focusCircle.append('circle')
    .attr('r', 16)
    .attr('fill', '#04e330');
  focusCircle.append('circle')
    .attr('r', 26)
    .attr('fill', 'none')
    .attr('stroke', '#04e330');

  const focusLine = svg.append("g");
  focusLine.append('line')
    .attr('class', 'focus-line')
    .attr('x1', x(275))
    .attr('y1', 0)
    .attr('x2', x(275))
    .attr('y2', height)
    .style('stroke-width', 1.5)
    .style('stroke', '#000');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mousemove = (event) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bisect = d3.bisector(d => d.price).left;
    const x0 = x.invert(d3.pointer(event)[0]);
    const i = bisect(data.plPoints, x0, 1);
    const d0 = data.plPoints[i - 1];
    const d1 = data.plPoints[i];
    const d = x0 - d0.price > d1.price - x0 ? d1 : d0;

    const xPoint = x(d.price)
    let xText = xPoint;
    if (xText >= 621) xText = 497;
    else if (xText <= 119) xText = 0;
    else xText -= 124;

    let xTextValue = xPoint;
    if (xTextValue <= 27) xTextValue = 0
    else if (d.price === data.maxPrice) xTextValue = 640;
    else if (xTextValue >= 717) xTextValue = 690;
    else xTextValue -= 27;

    const price = d.price;
    let priceText = `$${price}`;
    if (price >= data.maxPrice) priceText = 'Unlimited'

    focus.select(".focus-title").attr('x', xText);
    focus.select(".focus-value").attr("x", xTextValue).text(priceText);
    focusCircle.attr('transform', `translate(${xPoint}, ${height / 2})`);
    focusLine.select(".focus-line").attr('x1', xPoint).attr('x2', xPoint);

    if (keyPoints.some(item => item.x === d.price)) {
      const item = keyPoints.find(item => item.x === d.price);
      item && (d3.select(`.${item.label.replace(' ', '')}`)
        .select('circle')
        .transition().duration(300)
        .attr('r', 10));
      keyPoints.filter(item => item.x !== d.price).forEach(item => {
        const dom = document.querySelector(`#${item.label.replace(' ', '')}`) as HTMLElement;
        dom.classList.add('opacity-30')
      })
    } else {
      d3.selectAll('.key-point').selectChild('circle').attr('r', 6)
      keyPoints.forEach(item => {
        const dom = document.querySelector(`#${item.label.replace(' ', '')}`) as HTMLElement;
        dom.classList.contains('opacity-30') && dom.classList.remove('opacity-30')
      })
    }
  }

  // 添加关键点和标签
  const points = svg.selectAll(".key-point")
    .data(keyPoints)
    .enter()
    .append("g")
    .attr("class", (d) => `key-point ${d.label.replace(' ', '')}`);

  points.append("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 6)
    .attr("fill", d => d.color);

  // 添加X轴
  svg.append("g")
    .attr('class', 'x axis bottom')
    .attr("transform", `translate(0,${y(0)})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .attr("fill", "black");
  svg.selectAll('.x.axis .tick').remove();

  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .style("opacity", 0)
    .on("mouseover", () => {
      focus.style("display", null);
      focusLine.style("display", null);
      focusCircle.style("display", null);
    })
    // .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", mousemove);
}

export default createPLChart;
