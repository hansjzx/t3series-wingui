import React, { Component } from 'react';
import d3Tip from 'd3-tip';
import { zAxios } from '@zionex/wingui-core/src/common/imports';
import { usePreviousProps } from '@mui/utils';
const d3 = require('d3');

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.width = props.size[0];
    this.height = props.size[1];
    this.startDate = props.dates[0];
    this.endDate = props.dates[1];
    this.data = [];
    this.abcXyz = {};
    this.targetCol = props.targetCol;
    this.yAxisName = props.yAxisName;
    this.loadHeatMap.bind(this);
    this.gradeA = props.gradeA;
    this.gradeB = props.gradeB;
    this.gradeC = 0;
    this.gradeX = props.gradeX.toFixed(1).toString();
    this.gradeY = props.gradeY.toFixed(1).toString();
    this.gradeZ = props.gradeZ.toFixed(1).toString();
    this.cov_min = props.cov_min.toFixed(1).toString();
    this.targets = [];
    this.tabValue = props.tabValue;
    this.padding = 4;
    this.wasDragged = false
  }

  componentDidUpdate(prevProp) {
    if (this.name === this.props.tabValue) {
      if (this.props.reload_status) {
        this.startDate = this.props.dates[0];
        this.endDate = this.props.dates[1];
        this.startDate = this.props.dates[0];
        this.endDate = this.props.dates[1];
        this.gradeA = this.props.gradeA;
        this.gradeB = this.props.gradeB;
        this.gradeX = this.props.gradeX.toFixed(1).toString();
        this.gradeY = this.gradeY = this.props.gradeY > 3.9 ? "3.9" : this.props.gradeY.toFixed(1).toString();
        this.gradeZ = this.props.gradeY > 3.9 ? "4.0" : this.props.gradeZ.toFixed(1).toString();
        this.cov_min = this.props.cov_min.toFixed(1).toString();
        this.data = [];
        this.targets = this.props.targets;
        this.tabValue = this.props.tabValue;
        this.loadHeatMap();
        this.props.reload_setter({
          startDate: this.props.dates[0],
          endDate: this.props.dates[1],
          reload: false
        });
  
      }
      if ((Math.abs(this.props.size[0] - prevProp.size[0]) > 10 || Math.abs(this.props.size[1] - prevProp.size[1]) > 10)) {
        this.width = this.props.size[0];
        this.height = this.props.size[1];
  
        if (prevProp.size[0] && prevProp.size[1]) {
          this.loadHeatMap();
        }
      }
      if (this.props.gradeA !== prevProp.gradeA || this.props.gradeB !== prevProp.gradeB 
        || this.props.gradeX !== prevProp.gradeX || this.props.gradeY !== prevProp.gradeY) {
        this.gradeA = this.props.gradeA;
        this.gradeB = this.props.gradeB;
        this.gradeX = this.props.gradeX.toFixed(1).toString();
        this.gradeY = this.props.gradeY > 3.9 ? "3.9" : this.props.gradeY.toFixed(1).toString();
        this.gradeZ = this.props.gradeY > 3.9 ? "4.0" : this.props.gradeZ.toFixed(1).toString();
  
        this.loadHeatMap();
      }
      if (this.props.targets.length !== prevProp.targets.length) {
        this.targets = this.props.targets;
        this.tabValue = this.props.tabValue;
        if ((this.props.targets.length >= 0 && !this.wasDragged) || (this.props.targets.length > 0 && this.wasDragged)) {
          this.selectHeatMap();
        }
      }
      if (this.props.tabValue !== prevProp.tabValue) {
        this.width = this.props.size[0];
        this.height = this.props.size[1];
        this.gradeA = this.props.gradeA;
        this.gradeB = this.props.gradeB;
        this.gradeX = this.props.gradeX.toFixed(1).toString();
        this.gradeY = this.props.gradeY > 3.9 ? "3.9" : this.props.gradeY.toFixed(1).toString();
        this.gradeZ = this.props.gradeY > 3.9 ? "4.0" : this.props.gradeZ.toFixed(1).toString();
        this.loadHeatMap();
      }
    }
  }

  loadHeatMap() {
    if ((this.data.length === 0 || this.props.reload_status)) {
      zAxios({
        method: 'post',
        headers: { 'content-type': 'application/json' },
        url: baseURI() + 'engine/bf/DoHeatMapLoad',
        params: {
          'startDate': this.startDate,
          'endDate': this.endDate,
          'col': this.targetCol,
          'cov_min': parseFloat(this.cov_min),
          'cov_max': parseFloat(this.gradeZ) + 0.1,
          'timeout': 0
        }
      })
        .then(response => {
          this.status = response.data.RESULT_SUCCESS;
          if (this.status) {
            this.data = response.data.RESULT_DATA;
            if (this.data.length > 0) {
              this.createHeatMap();
            }
          }
        });
    }
    else {
      this.createHeatMap();
    }
  }

  selectHeatMap() {
    d3.select(this.node).selectAll('#selected').remove();
    const gradeA = this.gradeA;
    const gradeB = this.gradeB;
    const gradeC = this.gradeC;
    const gradeX = this.gradeX;
    const gradeY = this.gradeY;
    const gradeZ = this.gradeZ;
    const targetMap = this.name;
    const targetCol = this.targetCol;
    const selected = [];

    let dat = Array.from(d3.selectAll('#' + targetMap).data());

    dat.sort((a, b) => {
      if (a.pct < b.pct)
        return 1;

      if (a.pct > b.pct)
        return -1;

      if (a.cov_lbl > b.cov_lbl)
        return 1;

      if (a.cov_lbl < b.cov_lbl)
        return -1;

      return 0;
    });

    if (this.targets.includes('AX')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) < gradeX && parseFloat(dat[i].cov_lbl) >= 0
          && dat[i].pct >= gradeA && dat[i].pct <= 100) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('BX')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) < gradeX && parseFloat(dat[i].cov_lbl) >= 0
          && dat[i].pct >= gradeB && dat[i].pct < gradeA) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('CX')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) < gradeX && parseFloat(dat[i].cov_lbl) >= 0
          && dat[i].pct >= gradeC && dat[i].pct < gradeB) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('AY')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) < gradeY && parseFloat(dat[i].cov_lbl) >= gradeX
          && dat[i].pct >= gradeA && dat[i].pct <= 100) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('BY')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) < gradeY && parseFloat(dat[i].cov_lbl) >= gradeX
          && dat[i].pct >= gradeB && dat[i].pct < gradeA) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('CY')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) < gradeY && parseFloat(dat[i].cov_lbl) >= gradeX
          && dat[i].pct >= gradeC && dat[i].pct < gradeB) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('AZ')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) <= gradeZ && parseFloat(dat[i].cov_lbl) >= gradeY
          && dat[i].pct >= gradeA && dat[i].pct <= 100) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('BZ')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) <= gradeZ && parseFloat(dat[i].cov_lbl) >= gradeY
          && dat[i].pct >= gradeB && dat[i].pct < gradeA) {
          selected.push(dat[i]);
        }
      }
    }
    if (this.targets.includes('CZ')) {
      for (let i = 0; i < dat.length; i++) {
        if (parseFloat(dat[i].cov_lbl) <= gradeZ && parseFloat(dat[i].cov_lbl) >= gradeY
          && dat[i].pct >= gradeC && dat[i].pct < gradeB) {
          selected.push(dat[i]);
        }
      }
    }

    const boxWidth = d3.select('#' + targetMap).attr('width');
    const boxHeight = d3.select('#' + targetMap).attr('height');
    const selectBox = d3.selectAll('#' + targetMap).filter(d => { return selected.includes(d); })

    let selectXY = []
    for (let i = 0; i < selectBox._groups[0].length; i++) {
      selectXY.push({
        x: d3.select(selectBox._groups[0][i]).attr('x'),
        y: d3.select(selectBox._groups[0][i]).attr('y')
      })
    }

    const map = d3.select(this.node);

    for (let i = 0; i < selectXY.length; i++) {
      map
        .append('rect')
        .attr('id', 'selected')
        .attr('x', selectXY[i].x)
        .attr('y', selectXY[i].y)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('fill', d3.rgb(0, 0, 10, 0.2))
        .style('stroke-width', '0.5')
        .on('click', (d) => { d3.selectAll('#selected').remove() });
    }


    let targetCnt = 0;
    let formData = new URLSearchParams();
    selected.forEach(elem => {
      targetCnt += elem.sub_count;
      formData.append('selected', JSON.stringify(elem));
    });
      formData.append('col', this.targetCol);
      formData.append('gradeA', this.gradeA);
      formData.append('gradeB', this.gradeB);
      formData.append('gradeX', this.gradeX);
      formData.append('gradeY', this.gradeY);

    if (this.tabValue === this.name) {
      zAxios({
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: baseURI() + 'engine/bf/DoHeatMapDrag',
        data: formData,
        // params: { 'timeout': 0, 'col': this.targetCol }
      })
        .then(() => {
          this.props.select_handler({dragged: false, targetCol: this.targetCol, selectedTarget: true});
          this.wasDragged = false;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  drawRect(svg) {
    // d3.selectAll('#abcRect').remove();
    let grade = ["A", "B", "C"];
    let cv = ["X", "Y", "Z"];

    let threshold = {
      'A': [this.y_scale(this.gradeA) + this.y_scale.bandwidth(), this.y_scale(95)],
      'B': [this.y_scale(this.gradeB) + this.y_scale.bandwidth(), this.gradeA < 95 ? this.y_scale(this.gradeA) + this.y_scale.bandwidth() : this.y_scale(95) + this.y_scale.bandwidth()],
      'C': [this.y_scale(this.gradeC) + this.y_scale.bandwidth(), this.y_scale(this.gradeB)+ this.y_scale.bandwidth()],
      
      'X': [this.x_scale(this.gradeX), this.x_scale(this.cov_min)],
      'Y': [parseFloat(this.gradeZ) < 4.0 ? this.x_scale(this.gradeY) : this.x_scale(this.gradeY) + this.x_scale.bandwidth(), this.x_scale(this.gradeX)],
      'Z': [this.x_scale(this.gradeZ) + this.x_scale.bandwidth(), this.x_scale(this.gradeY)],
    }
    let rectColor = {
      'AX': 'green',
      'BX': 'green',
      'CX': 'orange',
      'AY': 'green',
      'BY': 'orange',
      'CY': 'red',
      'AZ': 'orange',
      'BZ': 'red',
      'CZ': 'red',
    }

    if (this.gradeA > 95) {
      grade.splice(grade.indexOf('A'), 1);
    }
    if (this.gradeA === this.gradeB) {
      grade.splice(grade.indexOf('B'), 1);
    }
    if (this.gradeB < 5) {
      grade.splice(grade.indexOf('C'), 1);
    }
    if (parseFloat(this.gradeX) < 0.1) {
      cv.splice(cv.indexOf('X'), 1);
    }
    if (parseFloat(this.gradeX) === parseFloat(this.gradeY)) {
      cv.splice(cv.indexOf('Y'), 1);
    }
    if (parseFloat(this.gradeZ) >= 4.0) {
      cv.splice(cv.indexOf('Z'), 1);
    }
    grade.forEach(g => {
      cv.forEach(c => {
        svg
          .append("rect")
          .style("stroke", rectColor[g+c])
          .style("stroke-width", this.padding - 0.5)
          .style("stroke-opacity", 1)
          .style('fill-opacity', 0)
          .attr('id', 'abcRect')
          .attr("pointer-events", "none")
          .attr("x", threshold[c][1] + this.margin.left + this.padding)
          .attr("y", threshold[g][1] + this.margin.top + this.padding)
          .attr("width", threshold[c][0] - threshold[c][1] - this.padding)
          .attr("height", threshold[g][0] - threshold[g][1] - this.padding);
        svg
          .append("text")
          .attr("x", (threshold[c][0] + threshold[c][1]) / 2 + this.margin.left)
          .attr("y", (threshold[g][0] + threshold[g][1] + this.y_scale.bandwidth()) / 2 + this.margin.top)
          .attr("font-size", "15px")
          .attr('id', 'abcRect')
          .attr("pointer-events", "none")
          .text(g+c)
      })
    })
  }

  process_data = (grp_dat) => {
    let ra = Array(grp_dat.length * this.x_label.length);

    for (let i = 0; i < ra.length; i += this.x_label.length) {
      for (let j = 0; j < this.x_label.length; j++) {
        ra[i + j] = {
          pct: grp_dat[parseInt(i / this.x_label.length)].pct,
          cov_lbl: this.x_label[j],
          sub_count: grp_dat[parseInt(i / this.x_label.length)][this.x_label[j]]
        }
      }
    }

    return ra;
  }

  createHeatMap() {
    d3.select(this.node).selectAll('*').remove();
    const node = this.node;
    const svg = d3.select(node);
    this.wasDragged = false;
    if (this.data && this.data.length > 0) {
      this.x_label = Object.keys(this.data[0]).sort().slice(0, -2);
      this.y_label = Array.from(new Set(d3.map(this.data, d => d.pct)));
      // this.y_label = this.data.map(function (row) { console.log(row);return row.pct});
      this.right_label = []
      for (let i = 0; i < this.data.length; i++) {
        this.right_label.push(this.data[i].cnt)
      }
      this.chart_dat = this.process_data(this.data);
      this.margin = ({ top: 50, left: 125, right: 100, bottom: 60 });
      this.right_scale = d3
        .scaleBand()
        .domain(d3.range(this.right_label.length))
        .range([this.height - this.margin.bottom - this.margin.top, 0]);
      this.y_scale = d3
        .scaleBand()
        .domain(this.y_label)
        .range([this.height - this.margin.bottom - this.margin.top, 0]);
      this.x_scale = d3
        .scaleBand()
        .domain(this.x_label)
        .range([0, this.width - this.margin.left - this.margin.right]);
      this.color_scale = d3
        .scaleSequential(d3.interpolateYlOrRd)
        .domain([0, d3.max(this.chart_dat, d => d.sub_count)]);

      this.valRange = [0, d3.max(this.chart_dat, d => d.sub_count)];
      this.legendBins = [...Array(9).keys()].map(x => d3.quantile(this.valRange, x * 0.1));
      this.legendHeight = 10;
      this.legendElementWidth = (this.width - this.margin.left - this.margin.right) / 9;
    }

    svg
      .append('g')
      .attr("transform", `translate(${(this.margin.left) - 50}, ${(this.height) / 2})`)
      .append('text')
      .attr("transform", "rotate(270)")
      .style("text-anchor", "middle")
      .style("font-size", "15px")
      .style('font-family', 'Noto Sans KR')
      .text(transLangKey(this.yAxisName));

    svg
      .append('g')
      .attr("transform", `translate(${(this.width) / 2}, ${this.margin.top / 2})`)
      .append('text')
      .style("text-anchor", "center")
      .style("font-size", "15px")
      .style('font-family', 'Noto Sans KR')
      .text('CV');

    svg
      .append('g')
      // .attr("transform", `translate(${this.width - this.margin.right}, ${this.margin.top - 5})`)
      .attr("transform", `translate(${this.width - this.margin.right + 50}, ${(this.height) / 2})`)
      .append('text')
      .attr("transform", "rotate(270)")
      .style("text-anchor", "start")
      .style("font-size", "15px")
      .style('font-family', 'Noto Sans KR')
      .style('overflow', 'inherit')
      .text(transLangKey('SUM'));

    svg
      .append('g')
      // .attr("transform", `translate(${this.margin.left}, 0)`)
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisTop(this.x_scale).tickSize(0).tickPadding(7))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      // .attr("y", 7)
      .style("text-anchor", "center")
      .style("fill", "#777");

    svg
      .append('g')
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.y_scale).tickSize(0).tickPadding(7))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .style("fill", "#777");

    svg
      .append('g')
      .attr('transform', `translate(${this.width - this.margin.right}, ${this.margin.top})`)
      .call(d3.axisRight(this.right_scale).tickFormat((d, i) => this.right_label[i]).tickSize(2).tickPadding(7))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .style("fill", "#777");

    svg
      .selectAll('g')
      .data(this.chart_dat)
      .enter()
      .append('g')
      .attr("transform", d => `translate(0,${this.y_scale(d.pct) + 1})`);

    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([3, 0])
      .direction('s')
      .style('font-family', 'Noto Sans KR')
      .style('line-height', 1.2)
      .style('font-size', '15px')
      .style("background-color", d3.rgb(0, 0, 0, 0.7))
      .style("color", 'white')
      .style("border", "None")
      .style("border-width", "1px")
      .style("border-radius", "2px")
      .style("padding", "7px")
      .style('stroke', 'black')
      .html((e, d) => {
        return `${transLangKey(this.yAxisName)} : ${d.pct}<br>cv : ${d.cov_lbl}<br>count : ${d.sub_count}`
      });
    // .html(function(d) {
    //     return `qty : ${d.pct}<br>cov : ${d.cov_lbl}<br>count : ${d.sub_count}`;
    // })
    svg.call(tip);

    svg.selectAll()
      .data(this.chart_dat)
      .enter()
      .append('rect')
      .attr('id', this.name)
      .attr('x', d => this.x_scale(d.cov_lbl) + this.margin.left)
      .attr('y', d => this.y_scale(d.pct) + this.margin.top)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', this.x_scale.bandwidth())
      .attr('height', this.y_scale.bandwidth())
      .attr('fill', d => this.color_scale(d.sub_count))
      .style('stroke', 'white')
      .style('fill-opacity', 0.6)
      .on('mouseover', tip.show)
      .on('mousemove', (d) => { this.highlight(d, this); })
      .on('mouseleave', (d) => { this.unhighlight(d, this); })
      .on('mouseout', tip.hide)
      .call(
        d3.drag()
          .on('start', (e, d) => {
            this.cumm_dx = 0;
            this.cumm_dy = 0;
            this.drag_startX = d3.select(e.sourceEvent.target).attr('x') - 1;
            this.drag_startY = d3.select(e.sourceEvent.target).attr('y') - 1;
            // this.drag_startX = d3.select(d3.event.sourceEvent.target).attr('x') - 1;
            // this.drag_startY = d3.select(d3.event.sourceEvent.target).attr('y') - 1;

            // d3.event.sourceEvent.stopPropagation();
            e.sourceEvent.stopPropagation();
            this.props.select_handler({dragged: false, targetCol: this.targetCol, selectedTarget: false});
          })
          .on('drag', (e, d) => {
            d3.selectAll('#selected').remove();
            this.cumm_dx += e.dx;
            this.cumm_dy += e.dy;
            // this.cumm_dx += d3.event.dx;
            // this.cumm_dy += d3.event.dy;

            if (this.cumm_dx < 0) {
              this.select_startX = Math.max(e.x + 1, this.margin.left);
              // this.select_startX = Math.max(d3.event.x + 1, this.margin.left);
              this.select_endX = this.drag_startX + this.x_scale.bandwidth();
            } else {
              this.select_startX = this.drag_startX;
              this.select_endX = Math.min(e.x - 1, this.width - this.margin.right);
              // this.select_endX = Math.min(d3.event.x - 1, this.width - this.margin.right);
            }

            if (this.cumm_dy < 0) {
              this.select_startY = Math.max(e.y + 1, this.margin.top);
              // this.select_startY = Math.max(d3.event.y + 1, this.margin.top);
              this.select_endY = this.drag_startY + this.y_scale.bandwidth();
            } else {
              this.select_startY = this.drag_startY;
              this.select_endY = Math.min(e.y - 1, this.height - this.margin.bottom);
              // this.select_endY = Math.min(d3.event.y - 1, this.height - this.margin.bottom);
            }
            d3.select(this.node)
              .append('rect')
              .attr('id', 'selected')
              .attr('x', this.select_startX)
              .attr('y', this.select_startY)
              .attr('fill', d3.rgb(0, 0, 10, 0.1))
              .attr('width', Math.abs(this.select_startX - this.select_endX))
              .attr('height', Math.abs(this.select_startY - this.select_endY))
              .style('stroke', 'black')
              .style('stroke-width', '0.5')
              .on('click', (d) => { d3.selectAll('#selected').remove(); });

            this.wasDragged = true;
          })
          .on('end', (e, d) => {
            if (this.wasDragged === true) {
              const endrect_x = parseFloat(d3.select(e.sourceEvent.target).attr('x'));
              const endrect_y = parseFloat(d3.select(e.sourceEvent.target).attr('y'));
              // const endrect_x = parseFloat(d3.select(d3.event.sourceEvent.toElement).attr('x'));
              // const endrect_y = parseFloat(d3.select(d3.event.sourceEvent.toElement).attr('y'));

              if (this.cumm_dx < 0) {
                this.select_startX = Math.max(Number.isNaN(endrect_x) ? 0 : endrect_x, this.margin.left);
              } else {
                this.select_endX = Math.min(
                  Number.isNaN(endrect_x) ? (this.width - this.margin.right) : (endrect_x + this.x_scale.bandwidth()),
                  this.width - this.margin.right
                );
              }

              if (this.cumm_dy < 0) {
                this.select_startY = Math.max(Number.isNaN(endrect_y) ? 0 : endrect_y, this.margin.top);
              } else {
                this.select_endY = Math.min(
                  Number.isNaN(endrect_y) ? (this.height - this.margin.bottom) : (endrect_y + this.y_scale.bandwidth()),
                  this.height - this.margin.bottom
                );
              }

              d3.selectAll('#selected').remove();
              d3.select(this.node)
                .append('rect')
                .attr('id', 'selected')
                .attr('x', this.select_startX)
                .attr('y', this.select_startY)
                .attr('fill', d3.rgb(0, 0, 10, 0.2))
                .attr('width', Math.abs(this.select_startX - this.select_endX))
                .attr('height', Math.abs(this.select_startY - this.select_endY))
                .style('stroke', 'black')
                .style('stroke-width', '0.5')
                .on('click', (d) => { d3.selectAll('#selected').remove() });


              const selected_xy = [];
              this.x_label.forEach(x => {
                if (Math.round(this.select_startX) <= Math.round(this.x_scale(x) + this.margin.left) 
                && Math.round(this.select_endX) > Math.round(this.x_scale(x) + this.margin.left)) {
                  this.y_label.forEach(y => {
                    if (Math.round(this.select_startY) <= Math.round(this.y_scale(y) + this.margin.top) 
                    && Math.round(this.select_endY) > Math.round(this.y_scale(y) + this.margin.top)) {
                      selected_xy.push({'cov_lbl': x, 'pct': y});
                    }
                  })
                }
              })

              let formData = new URLSearchParams();
              selected_xy.forEach(e => {
                formData.append('selected', JSON.stringify(e));
              });
              formData.append('col', this.targetCol);
              formData.append('gradeA', this.gradeA);
              formData.append('gradeB', this.gradeB);
              formData.append('gradeX', this.gradeX);
              formData.append('gradeY', this.gradeY);
              zAxios({
                method: 'post',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: baseURI() + 'engine/bf/DoHeatMapDrag',
                data: formData,
                // params: { 'timeout': 0, 'col': this.targetCol }
              })
                .then(() => {
                  this.props.select_handler({dragged: true, targetCol: this.targetCol, selectedTarget: false})
                })
                .catch(error => {
                  console.log(error);
                });
            }

            // this.wasDragged = false;
          })
      )
      .on('click', (e) => {
        //if (d3.event.defaultPrevented === false) // v5
        if (e.defaultPrevented === false) {
          d3.selectAll('#selected').remove();
        }
      });

    // ABC-XYZ
    this.drawRect(svg);

    const legend = svg.append("g")
      .attr("transform", d => `translate(${this.margin.left},0)`);

    legend
      .selectAll("rect")
      .data(this.legendBins)
      .enter()
      .append("rect")
      .attr("x", (d, i) => this.legendElementWidth * i)
      .attr("y", this.height - this.margin.bottom + this.legendHeight)
      .attr("width", this.legendElementWidth)
      .attr("height", this.legendHeight)
      .style("fill", d => this.color_scale(d));

    legend
      .selectAll("text")
      .data(this.legendBins)
      .enter()
      .append("text")
      .text(d => " ≥" + d.toExponential(1))
      .attr("x", (d, i) => this.legendElementWidth * i + 5)
      .attr("y", this.height - this.margin.bottom + (this.legendHeight * 3))
      .style("font-size", "9pt")
      .style("font-family", "Consolas, courier")
      .style("fill", "#aaa")
      .style('fill-opacity', 0.7);

      this.props.reload_setter({
        initLoad: true
      });
  }

  highlight = (e) => {
    d3
      .select(e.target)
      // .select(d3.event.target)
      .style('stroke', 'gray')
      .style('fill-opacity', 1)
      // shrink a bit to make room for stroke, now visible
      .attr('x', d => this.x_scale(d.cov_lbl) + this.margin.left + 1)
      .attr('y', d => this.y_scale(d.pct) + this.margin.top + 1)
      .attr('width', this.x_scale.bandwidth() - 2)
      .attr('height', this.y_scale.bandwidth() - 2);
  }

  unhighlight = (e) => {
    d3
      .select(e.target)
      // .select(d3.event.target)
      .attr('x', d => this.x_scale(d.cov_lbl) + this.margin.left)
      .attr('y', d => this.y_scale(d.pct) + this.margin.top)
      .attr('width', this.x_scale.bandwidth())
      .attr('height', this.y_scale.bandwidth())
      .style('stroke', 'white')
      .style('fill-opacity', 0.7);
  }

  render() {
    return (
      <svg
        ref={(node) => { this.node = node }}
        id={'heatmap' + this.name}
        width={this.width}
        height={this.height}>
      </svg>
    );
  }
}

export default HeatMap;
