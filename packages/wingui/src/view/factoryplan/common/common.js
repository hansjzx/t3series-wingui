import { transLangKey } from '@wingui';
import { defaults } from 'chart.js';
import { zAxios } from '@zionex/wingui-core/src/service/serviceCall';

export const fpCommonStyles = {
  roundButton: {
    borderRadius: 4,
    minWidth: 170,
    width: 'fit-content'
  },
  primaryButton: {
    border: 'none',
    borderRadius: 1,
    margin: 0,
    '&:hover':{
      color: '#fff'
    }
  },
  tabInner: {
    height: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  tabLabelBox: {
    borderBottom: 1,
    borderColor: 'divider'
  },
  splitArea: {
    mx: '5px',
    display: 'flex',
    flexDirection: 'column'
  }
};

export function setCellButtonRenderer(gridView, columnName, visibleOnlyCreated = false) {
  const cellBtnRenderer = `${columnName}_cellBtnRenderer`;
  gridView.registerCustomRenderer(cellBtnRenderer, {
    initContent : function (parent) {
      let text = this._text = document.createElement('div');
      parent.appendChild(text);
      let button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<i class="fa fa-search" style="color: #545454; font-size: 1.7em !important;" aria-hidden="true"></i>`;
      this._button1 = button;
      parent.appendChild(this._button1);
    },
    canClick : function() {
      return true;
    },
    clearContent : function(parent) {
        parent.innerHTML = '';
    },
    render : function(grid, model, width, height, info) {
      let textContent = model.value;
      if (this._dom.parentElement.classList.contains('rg-data-empty-cell')) {
        textContent = grid.getColumnProperty(columnName, 'placeHolder');
      }
      let text = this._text;
      text.className = 'renderer-cell-text';
      text.textContent = textContent;
      this._value = model.value;
      let button = this._button1;
      button.className = 'btn btn-light cell-search-btn';
      if (visibleOnlyCreated) {
        if (grid.getDataSource().getRowState(model.index.dataRow) !== 'created') {
          button.className = 'btn btn-light cell-search-btn-created';
        }
      }
      if (this._dom.nextElementSibling && this._dom.nextElementSibling.classList.contains('rg-cell-buttons')) {
        button.style.right = this._dom.nextElementSibling.style.width;
      } else {
        button.style.right = '1px';
      }
    },
    click : function(event) {
      let index = this.index.toProxy();
      if (this._button1.contains(event.target)) {
        return {
          cellType: 'data',
          target : event.target,
          index: index,
          value: this._value
        }
      }
    }
  });
  gridView.setColumnProperty(columnName, 'renderer', cellBtnRenderer);
}

export function setGridComboList(gridView, columnName, codeGroupCd) {
  zAxios.get(baseURI() + 'factoryplan/codes', {
    params: { 'code-group-cd': codeGroupCd },
    waitOn: false
  })
    .then(function (response) {
      const list = response.data.map(function (data) {
        const trans = transLangKey(data.codeGroupCd + '_' + data.codeCd);
        const label = (trans === (data.codeGroupCd + '_' + data.codeCd)) ? data.codeCd : trans;
        return { value: data.codeCd, label: label };
      });
      gridView.setColumnProperty(columnName, 'lookupDisplay', true);
      gridView.setColumnProperty(columnName, 'lookupData', { value: 'value', label: 'label', list: list });
    })
    .catch(function (err) {
      console.log(err);
    })
}

export function getCodeEditor(codeGroupCd) {
  let ret = {};
  // let ret.editor = {};

  zAxios.get(baseURI() + 'factoryplan/codes', {
    params: { 'code-group-cd': codeGroupCd },
    waitOn: false
  })
  .then(function (response) {
    const values = response.data.map(function (data) {
      return [data.codeCd];
    });

    const labels = response.data.map(function (data) {
      const key = data.codeGroupCd + '_' + data.codeCd;
      const label = transLangKey(key) === key ? data.codeCd : data.codeCd + ' - ' + transLangKey(key);

      return [label];
    });

    const list = response.data.map(function (data) {
      const trans = transLangKey(data.codeGroupCd + '_' + data.codeCd);
      const label = (trans === (data.codeGroupCd + '_' + data.codeCd)) ? data.codeCd : trans;
      return { value: data.codeCd, label: label };
    });

    let editor = {};

    editor.type = 'dropdown';
    editor.values = values;
    editor.labels = labels;

    ret.editor = editor;
  })
  .catch(function (err) {
    console.log(err);
  })

  return ret;
}

export function setEditableGrid(grid) {
  grid.dataProvider.setOptions({ restoreMode: "auto" });
  grid.gridView.setStateBar({ visible: true });
  grid.gridView.setCheckBar({ visible: true, syncHeadCheck: true });
  grid.gridView.setDisplayOptions({ fitStyle: "even" });
  grid.gridView.setFilteringOptions({
    enabled: true,
    selector: { searchIgnoreCase: true },
    automating: { lookupDisplay: true }
  });
}

export function setNoneEditableGrid(grid) {
  grid.gridView.setFooters({ visible: false });
  grid.gridView.setCheckBar({ visible: false });
  grid.gridView.setStateBar({ visible: false });
  grid.gridView.setDisplayOptions({ fitStyle: "even" });
  grid.gridView.setEditOptions({
    movable: false,
    rowMovable: false
  });
  grid.gridView.setFilteringOptions({
    enabled: true,
    selector: { searchIgnoreCase: true },
    automating: { lookupDisplay: true }
  });
}

export function setChartOptions(chart) {
  chart.options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 40, right: 60, top: 40, bottom: 8
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      point: {
        pointRadius: 4,
        pointBorderWidth: 1.5,
        pointBorderColor: '#fcfcfc',
        hoverRadius: 6,
        hoverBorderWidth: 1.5,
        hoverBorderColor: '#fcfcfc',
      },
      bar: {
        backgroundColor: ['#fed78c', '#a1d2fa', '#ff9cba', '#72e2e0', '#c8bcf9']
      }
    },
    scales: {
      x: {
        ticks: {
          padding: 15,
          font: { size: 13 },
          callback: (value) => value
        },
        grid: {
          drawTicks: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          padding: 15,
          font: { size: 13 },
          callback: (value) => value
        },
        grid: {
          drawTicks: false,
          drawBorder: false
        }
      }
    }
  };
  chart.update();
}

export function setChartCustomTooltip(chart, forDataLabel) {
  chart.options.plugins.tooltip.enabled = false;
  chart.options.plugins.tooltip.external = function(context) {
    const getOrCreateTooltip = (chart) => {
      let tooltipEl = chart.canvas.parentNode.querySelector('div');

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.style.background = 'rgba(0, 0, 0, 0.75)';
        tooltipEl.style.borderRadius = '5px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';
        tooltipEl.style.borderColor = 'transparent';

        const table = document.createElement('table');
        table.style.margin = '0px';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
      }

      return tooltipEl;
    };

    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // set caret
    tooltipEl.classList.remove('left', 'right', 'no-transform');
    if (tooltip.xAlign) {
      tooltipEl.classList.add(tooltip.xAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);

      const tableHead = document.createElement('thead');

      titleLines.forEach(title => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = 0;

        const th = document.createElement('th');
        th.style.borderWidth = 0;
        const text = document.createTextNode(title);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];

        const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = '2px';
        span.style.marginRight = '10px';
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.display = 'inline-block';

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;

        const td = document.createElement('td');
        td.style.borderWidth = 0;

        const text = document.createTextNode(body);
        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector('table');

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    const padding = { h: 3, v: 6 };
    tooltipEl.style.opacity = 1;
    if (chart.options.indexAxis === 'y') {
      tooltipEl.style.left = positionX + (forDataLabel && ((tooltip.xAlign === 'right') ? tooltip.caretX - tooltip.width / 2 - 70 : tooltip.caretX + tooltip.width / 2 + 7 + padding.h)) + 'px';
      tooltipEl.style.top = positionY + tooltip.caretY - (tooltip.height / 2) - 1 + 'px';
    } else {
      tooltipEl.style.left = positionX + ((tooltip.xAlign === 'right') ? tooltip.caretX - tooltip.width / 2 - 7 - padding.h : tooltip.caretX + tooltip.width / 2 + 7 + padding.h) + 'px';
      tooltipEl.style.top = positionY + tooltip.caretY - tooltip.height / 2 + padding.v + 'px';     
    }
    tooltipEl.style.padding = `${padding.h}px ${padding.v}px`;
  }
  chart.update();
}

export function setCodeColumnStyle(gridView, dataCell) {
  let style = {};
  if (dataCell.index.dataRow >= 0) {
    const rowState =  dataCell.item.rowState;
    if (rowState === 'created') {
      style.editable = true;
      style.styleName = 'editable-text-column';
    } else {
      style.editable = false;
      style.styleName = 'text-column';
    }
    return style;
  }
}

const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexFlow = 'row wrap';
    listContainer.style.justifyContent = 'center';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

export const ChartDataLabelPlugin = {
  id: 'chartDataLabel',
  afterDraw: (chart) => {
    let ctx = chart.ctx;
    ctx.font = "normal 15px 'Noto Sans KR','Helvetica','Arial',sans-serif";
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    chart.data.datasets.forEach((dataset, i) => {
      let meta = chart.getDatasetMeta(i);
      if (meta.type === 'bar') {
        meta.data.forEach((bar, index) =>{
          let data = dataset.data[index];
          if (data > 0) {
            ctx.fillText(data, (meta.indexAxis === 'y') ? bar.x - 30 : bar.x, (meta.indexAxis === 'x') ? bar.y + 20 : bar.y);
          }
        });
      }
    });
  }
}

export const ChartLegendPlugin = {
  id: 'customLegend',
  afterUpdate: (chart, args, options) => {
    if (options.containerID) {
      const ul = getOrCreateLegendList(chart, options.containerID);

      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove();
      }

      // Reuse the built-in legendItems generator
      const items = chart.options.plugins.legend.labels.generateLabels(chart);

      items.sort((a, b) => {
        return chart.data.datasets[a.datasetIndex].legendOrder - chart.data.datasets[b.datasetIndex].legendOrder;
      })

      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.alignItems = 'center';
        li.style.cursor = 'pointer';
        li.style.display = 'flex';
        li.style.flexDirection = 'row';
        if (items.length -1 !== index) {
          li.style.marginRight = '25px';
        }

        li.onclick = () => {
          if (chart.isDatasetVisible(item.datasetIndex)) {
            chart.hide(item.datasetIndex);
            item.hidden = true;
          } else {
            chart.show(item.datasetIndex);
            item.hidden = false;
          }
        };

        const type = chart.data.datasets[item.datasetIndex].type;

        // Color box
        const legendIcon = document.createElement((type === 'line') ? 'div' : 'span');
        legendIcon.style.background = item.fillStyle;
        legendIcon.style.borderColor = item.strokeStyle;
        legendIcon.style.borderWidth = '3px';
        legendIcon.style.display = 'inline-block';
        legendIcon.style.height = '13px';
        legendIcon.style.marginRight = '7px';
        legendIcon.style.width = '40px';
        legendIcon.style.borderRadius = '1px';
        if (type === 'line') {
          legendIcon.style.position = 'relative';
          legendIcon.style.background = item.strokeStyle;
          legendIcon.style.height = '4px';
          const lineLegendCircle = document.createElement('div');
          lineLegendCircle.style.position = 'absolute';
          lineLegendCircle.style.width = '9px';
          lineLegendCircle.style.height = '9px';
          lineLegendCircle.style.borderWidth = '1px';
          lineLegendCircle.style.borderStyle = 'solid';
          lineLegendCircle.style.borderColor = '#fcfcfc';
          lineLegendCircle.style.borderRadius = '50%';
          lineLegendCircle.style.left = '16px';
          lineLegendCircle.style.bottom = '-3px';
          lineLegendCircle.style.backgroundColor = item.strokeStyle;
          legendIcon.appendChild(lineLegendCircle);
        } else {
          legendIcon.style.height = '13px';
        }

        // Text
        const textContainer = document.createElement('p');
        textContainer.style.fontFamily = 'Malgun Gothic, 맑은 고딕, AppleSDGothicNeo-Light, sans-serif';
        textContainer.style.fontSize = '14px';
        textContainer.style.color = item.fontColor;
        textContainer.style.margin = 0;
        textContainer.style.padding = 0;
        if (item.hidden) {
          textContainer.style.textDecoration = 'line-through solid #838383 2px';
        }

        const text = document.createTextNode(item.text);
        textContainer.appendChild(text);

        li.appendChild(legendIcon);
        li.appendChild(textContainer);
        ul.appendChild(li);
      });
    }
    
  }
};

export function highlightChartByLabel(label, chart) {
  chart.data.datasets.forEach(dataset => {
    let backgroundColor = dataset.backgroundColor || chart.options.elements[dataset.type].backgroundColor;
    if (!Array.isArray(backgroundColor)) {
      backgroundColor = Array(chart.data.labels.length).fill(backgroundColor);
    }
    backgroundColor.forEach((color, index, colors) => {
      if (index === chart.data.labels.indexOf(label)) {
        colors[index] = color.length === 9 ? color.slice(0, -2) : color;
      } else {
        colors[index] = color.length === 9 ? color : color + '4D';
      }
    });
    dataset.backgroundColor = backgroundColor;
    if (dataset.type === 'line' && dataset.borderColor.length !== 9) dataset.borderColor = `${dataset.borderColor || chart.options.elements[dataset.type].borderColor}4D`;
  });
  chart.update();
}

export function resetChartHighlighting(chart) {
  chart.data.datasets.forEach(dataset => {
    let backgroundColor = dataset.backgroundColor || chart.options.elements[dataset.type].backgroundColor;
    if (!Array.isArray(backgroundColor)) {
      const length = (dataset.labels && Array.isArray(dataset.labels)) ? dataset.labels.length : 20;
      backgroundColor = Array(length).fill(backgroundColor);
    }
    backgroundColor.forEach((color, index, colors) => {
      colors[index] = color.length === 9 ? color.slice(0, -2) : color;
    });
    dataset.backgroundColor = backgroundColor;
    if (dataset.type === 'line' && dataset.borderColor && dataset.borderColor.length === 9) dataset.borderColor = dataset.borderColor.slice(0, -2);
  });
  chart.update();
}

export const ChartAxisTitlePlugin = {
  id: 'customTitle',
  afterDraw: (chart, args, opts) => {
    const { ctx, scales: { x, y }, chartArea: { top, bottom, left, right } } = chart;
    if (opts.y && Object.keys(opts.y).length > 0) {
      if (opts.y.left && opts.y.left.display) {
        const yLeft = opts.y.left;
        ctx.fillStyle = defaults.color;
        ctx.font = `14px ${defaults.font.family}`;
        ctx.fillText(yLeft.text, yLeft.offsetX || 18, (top + ((yLeft.offsetY * -1) || -20)));
      }
      if (opts.y.right && opts.y.right.display) {
        const yRight = opts.y.right;
        ctx.fillStyle = defaults.color;
        ctx.font = `14px ${defaults.font.family}`;
        ctx.fillText(yRight.text, right + (yRight.offsetX || 30), (top + ((yRight.offsetY * -1) || -20)));
      }

    }    
    if (opts.x && Object.keys(opts.x).length > 0) {
     if (opts.x.bottom && opts.x.bottom.display) {
       const xBottom = opts.x.bottom;
       ctx.fillStyle = defaults.color;
       ctx.font = `14px ${defaults.font.family}`;
       ctx.fillText(xBottom.text, (right + (xBottom.offsetX || 35)), (bottom + ((xBottom.offsetY * -1) || 22)));
     }
     if (opts.x.top) {
       
     }
    }
  }
};
