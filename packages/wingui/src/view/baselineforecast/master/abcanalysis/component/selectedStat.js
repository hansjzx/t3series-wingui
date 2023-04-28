import React, { Component } from 'react';
import { zAxios } from '@zionex/wingui-core/src/common/imports';
const d3 = require('d3');

class SelectedStat extends Component {
  constructor(props) {
    super(props);
    this.width = props.size[0];
    this.height = props.size[1];
    this.margin = { top: 30, bottom: 30, left: 40, right: 30 };
    this.labelHeight = 40
    this.avgFreq = 0;
    this.data = [];
    this.targetCol = props.targetCol;
  }

  componentDidUpdate(prevProp) {
    if ((this.props.trigger.clicked === 1 && prevProp.trigger.clicked === 0) &&
        (this.props.trigger.targetCol !== this.targetCol)) {
          d3.select(this.node).selectAll('*').remove();
        }
    else if ((this.props.trigger.clicked === 1 && prevProp.trigger.clicked === 0) &&
            (this.props.trigger.targetCol === this.targetCol)) {
      this.width = this.props.size[0];
      this.height = this.props.size[1];
      this.datarequest =
        zAxios({
          method: 'get',
          url: baseURI() + 'engine/bf/DoHeatMapGetTarget',
          params: { 'method': 'GET', 'col': this.targetCol, 'timeout': 0 }
        })
        .then(response => {
          this.data = response.data.RESULT_DATA.ITC1_DATA
          let targetMap = this.targetCol === "pct_rank_qty" ? 'heatMapQTY' : 'heatMapFillRate';

          if (d3.select('#heatmap' + targetMap).selectAll('#selected').size() > 0) {
            d3.select(this.node).selectAll('*').remove();
            if (this.data.length > 0 ) {
              this.createSelectedStat_hist();
              // this.createSelectedStat_pie();
            }
          }
          this.props.setResults({ 'selected': this.data.length, 'avgFreq': Math.round(this.avgFreq) });
        })
        .catch(error => {
          console.log(error)
        });
    }
    if ((Math.abs(this.props.size[0] - prevProp.size[0]) > 10 || Math.abs(this.props.size[1] - prevProp.size[1]) > 10)) {
      this.width = this.props.size[0];
      this.height = this.props.size[1];
      if (prevProp.size[0] && prevProp.size[1] && this.data.length > 0) {
        d3.select(this.node).selectAll('*').remove();
        this.createSelectedStat_hist();
      }
    }
  }

  getOverallStat() {
    let stat = {
      target_count: 0,
      avg_freq: 0,
      min_freq: Number.MAX_VALUE,
      max_freq: 0,
      min_sum: Number.MAX_VALUE,
      max_sum: 0,
      min_cov: Number.MAX_VALUE,
      max_cov: 0
    };

    stat.target_count = this.data.length;
    for (let i = 0; i < stat.target_count; i++) {
      stat.avg_freq += this.data[i].cnt;
      stat.max_freq = (stat.max_freq > this.data[i].cnt) ? stat.max_freq : this.data[i].cnt;
      stat.min_freq = (stat.min_freq < this.data[i].cnt) ? stat.min_freq : this.data[i].cnt;
      stat.max_sum = (stat.max_sum > this.data[i].sum) ? stat.max_sum : this.data[i].sum;
      stat.min_sum = (stat.min_sum < this.data[i].sum) ? stat.min_sum : this.data[i].sum;
      stat.max_cov = (stat.max_cov > this.data[i].cov) ? stat.max_cov : this.data[i].cov;
      stat.min_cov = (stat.min_cov < this.data[i].cov) ? stat.min_cov : this.data[i].cov;
    }
    stat.avg_freq = stat.avg_freq / stat.target_count;
    this.avgFreq = stat.avg_freq;

    return stat
  }

  createSelectedStat_hist() {
    const node = this.node;
    const svg = d3.select(node).append('svg').attr('id', 'sel-hist_'+this.targetCol);
    const stat = this.getOverallStat();

    // Select Summary
    svg
      .append('g')
      // .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .attr("transform", `translate(0, ${this.margin.top / 2})`)
      .append('text')
      .text(transLangKey('FCST_TARGET_CNT') + ' : ' + stat.target_count)
      .style('font-family', 'Noto Sans KR')
      .style("text-anchor", "center")
      .style("fill", "#000");

    svg
      .append('g')
      // .attr("transform", `translate(${(this.width - this.margin.left - this.margin.right) / 3 + this.margin.left}, ${this.margin.top})`)
      .attr("transform", `translate(0, ${this.margin.top})`)
      .append('text')
      .text(transLangKey('AVG_TXN_CNT_W') + ' : ' + parseInt(stat.avg_freq))
      .style('font-family', 'Noto Sans KR')
      .style("text-anchor", "center")
      .style("fill", "#000");

    // Title
    // svg
    //   .append('g')
    //   .attr("transform", `translate(${(this.width) / 2}, ${this.margin.top})`)
    //   .append("text")
    //   // .attr("x", (this.width / 2))
    //   // .attr("y", 0 - (this.margin.top / 2))
    //   .attr("text-anchor", "center")
    //   //.style("text-decoration", "underline")
    //   .style("font-size", "18px")
    //   .style('font-family', 'Noto Sans KR')
    //   .text("Histogram");

    // X axis
    svg
      .append('g')
      .attr("transform", `translate(${(this.width) / 2}, ${(this.height)})`)
      .append("text")
      .attr("text-anchor", "center")
      .style('font-family', 'Noto Sans KR')
      .style("font-size", "15px")
      .text("Txn Count")

    // Y axis
    svg
      .append('g')
      .attr("transform", `translate(${ this.margin.left / 3}, ${this.height / 2})`)
      .append("text")
      .attr("text-anchor", "start")
      .attr("transform", "rotate(270)")
      .style('font-family', 'Noto Sans KR')
      .style("font-size", "15px")
      .text(transLangKey('FREQUENCY'))

    // Freq Histogram
    const bins = d3
      .histogram()
      .value(d => d.cnt)
      .thresholds(20)(this.data);

    const x_scale = d3
      .scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([this.margin.left, this.width - this.margin.right]);

    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, d => d.length)]).nice()
      .range([this.height - this.margin.bottom, this.margin.top + this.labelHeight]);

    svg
      .append('g')
      .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(x_scale).tickSize(0))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .attr("y", 7)
      .style("fill", "#777");

    svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, 0)`)
      .call(d3.axisLeft(y_scale).tickSize(0))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      // .attr("y", 7)
      .style("text-anchor", "center")
      .style("fill", "#777");

    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', d => x_scale(d.x0) + 1)
      .attr('width', d => Math.max(0, x_scale(d.x1) - x_scale(d.x0) - 1))
      .attr('y', d => y_scale(d.length))
      .attr('height', d => y_scale(0) - y_scale(d.length));
  }

  createSelectedStat_pie() {
    const node = this.node;
    const svg = d3.select(node).append('svg').attr('id', 'sel-pie');
    const stat = this.getOverallStat();
    const r = (this.width - this.margin.left - this.margin.right) / 2;

    // Select Summary
    svg
      .append('g')
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .append('text')
      .text('# Selected: ' + stat.target_count)
      .style('font-family', 'Noto Sans KR')
      .style("text-anchor", "center")
      .style("fill", "#000");

    svg
      .append('g')
      .attr("transform", `translate(${(this.width - this.margin.left - this.margin.right) / 3 + this.margin.left}, ${this.margin.top})`)
      .append('text')
      .text('Avg Freq: ' + parseInt(stat.avg_freq))
      .style('font-family', 'Noto Sans KR')
      .style("text-anchor", "center")
      .style("fill", "#000");

    const graph = svg
      .append('g')
      .attr('transform', `translate(${(this.width - this.margin.left - this.margin.right) / 2 + this.margin.left}, ${this.height / 2 + this.margin.top})`)

    const bins = d3
      .bin()
      .value(d => d.cnt)
      .thresholds(5)(this.data);

    const pie = d3
      .pie()
      .sort(d => d.index)
      .value(d => d.length);


    const piedat = pie(bins);

    const color = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(piedat, d => { return d.value })]);

    const arc = d3
      .arc()
      .outerRadius(r)
      .innerRadius(0)

    let tip = graph
      .append('text')
      .style('position', 'absolute')
      .style('visibility', 'visible')

    graph
      .selectAll()
      .data(piedat)
      .enter()
      .append('path')
      .attr('id', d => { console.log(d); return 'arcpath' + d.index })
      .attr('d', arc)
      .attr('fill', d => { return color(d.value) })
      .attr('fill-opacity', 0.5)
      .style('stroke', 'black')
      .on("mouseover", (e, d) => {
        return tip
          .style("visibility", "visible")
          .text(d.data.x0 + '-' + d.data.x1 + ': ' + d.value);
      })
      .on("mousemove", (e) => { console.log(e); return tip.attr("y", (e.y - 550) + "px").attr("x", (e.x - 230) + "px"); })
    // .on("mouseout", function(){return tip.style("visibility", "hidden");});

    // for (let i = 0; i < piedat.length; i++) {
    //     const text = graph
    //         .append('text')
    //             .attr('x', 6)
    //             .attr('dy', -5)
    //     text
    //         .append('textPath')
    //         .attr('xlink:href', '#arcpath' + piedat[i].index)
    //         .text(piedat[i].value)
    // }

  }

  render() {
    return (
      <svg
        ref={(node) => { this.node = node }}
        id={'selectstat'}
        width={this.width}
        height={this.height}
        // key={this.k++}
      >
      </svg>
    );
  }
}

export default SelectedStat;