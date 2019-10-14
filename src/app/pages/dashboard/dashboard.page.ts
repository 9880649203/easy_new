import { Component } from '@angular/core';

//chart.js
import { ChartType, ChartOptions, ChartDataSets, } from 'chart.js';
import { SingleDataSet, Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ConfigService } from 'src/app/service/config.service';
import { MenuController } from '@ionic/angular';


/*  types of charts
1: total order amount as per the area
2: total indents vs successfull indents for each month
3: open orders for the admin to act on (status)
4: orders cancelled for a specified time (based on agency)
*/

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {



  //chart 1
  public chartOptions1: ChartOptions = {
    legend: {
      labels: {
        fontColor: 'white'
      }
    },
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Area Range'
        },
      }
      ],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Number of Order Range'
        }
      }]
    }
  };
  public chartType1: ChartType = 'doughnut';
  public chartLabels1: Label[] = ['Karnatka'];
  public chartData1: SingleDataSet = [0]
  public chartLegend1 = true;
  public chartPlugins1 = [];
  myColors = [
    {
      backgroundColor: ['rgb(184,222,73,0.8)	',
        'rgba(10,134, 147,0.95)',
        'rgba(47,18, 190,0.37)',
        'rgba(238,21, 86,0.37)',
        'rgba(21,238, 173,0.37)',
      ],
      borderColor: false,
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    },
    // ...colors for additional data sets
  ];

  //chart 2
  public chartOptions2: ChartOptions = {
    legend: {
      labels: {
        fontColor: 'white'
      }
    },
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white',

        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Period Range'
        },
      }
      ],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Number Range'
        }
      }]
    }
  };

  public chartType2: ChartType = 'bar';
  public chartLabels2: Label[] = ['February', 'March', 'April'];
  public chartData2: ChartDataSets[] = [
    {
      data: [80, 15, 30], label: 'Successfull Indents', backgroundColor: [
        'rgb(184,222,73,0.8)	',
        'rgba(10,134, 147,0.95)',
        'rgba(47,18, 190,0.37)',
        'rgba(238,21, 86,0.37)',
        'rgba(21,238, 173,0.37)',
      ],
    },
    {
      data: [100, 30, 80], label: 'Total Indents', backgroundColor: [
        'rgb(184,222,73,0.8)	',
        'rgba(10,134, 147,0.95)',
        'rgba(47,18, 190,0.37)',
        'rgba(238,21, 86,0.37)',
        'rgba(21,238, 173,0.37)',
      ]
    },

  ];
  public chartLegend2 = true;
  public chartPlugins2 = [];

  //chart 3
  public chartOptions3: ChartOptions = {
    legend: {
      labels: {
        fontColor: 'white'
      }
    },
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Period Range'
        },
      }
      ],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Number of Order Range'
        }
      }]
    }
  };

  public chartType3: ChartType = 'bar';
  public chartLabels3: Label[] = ['February', 'March', 'April'];
  public chartData3: SingleDataSet = [10, 100, 30]
  public chartLegend3 = true;
  public chartPlugins3 = [];
  myColor3 = [
    {
      backgroundColor: 'rgba(10,134, 147,0.95)',
      borderColor: false,
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    },
  ];

  //chart 4
  public chartOptions4: ChartOptions = {
    legend: {
      labels: {
        fontColor: 'white'
      }
    },
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Period Range'
        },
      }
      ],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          fontColor: 'white',
          display: true,
          labelString: 'Number of Order Range'
        }
      }]
    }
  };

  public chartType4: ChartType = 'pie';
  public chartLabels4: Label[] = ['February', 'March', 'April'];
  public chartData4: SingleDataSet = [10, 90, 80]
  public chartLegend4 = true;
  public chartPlugins4 = [];
  myColors4 = [
    {
      backgroundColor: [
        'rgb(184,222,73,0.8)	',
        'rgba(10,134, 147,0.95)',
        'rgba(47,18, 190,0.37)',
        'rgba(238,21, 86,0.37)',
        'rgba(21,238, 173,0.37)',

      ],
      borderColor: false,
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    },
    // ...colors for additional data sets
  ];

  chart1Request = { area: "state" };
  chart2Request = { period: "month" };
  chart3Request = { period: "month" };
  chart4Request = { period: "month", agency: "all" };
  selectedChart1Value = 'Doughnut';
  selectedChart2Value = 'Bar';
  selectedChart3Value = 'Bar'
  selectedChart4Value = 'Doughnut'
  chartOptionToSelectSingleData = ['Doughnut', 'Bar', 'Line', 'Pie', 'Radar', 'polarArea']
  chartOptionToSelectDoubleData = ['Bar', 'Line', 'Radar']
  selectedChart1AreaValue = 'District';
  selectedChart2PeriodValue = 'Month';
  selectedChart3PeriodValue = 'Month';
  selectedChart4PeriodValue = 'Month';
  selectedChart4AgencyValue = 'All';
  chartOptionToSelectAgency = ['All'];
  chartOptionToSelectArea = ['District']
  chartOptionToSelectPeriod = ['Month', 'Year']

  // chart01 = [{ id: "district1", count: 10 },
  // { id: "district2", count: 2 },
  // { id: "district3", count: 20 }]
  // chart02 = [
  //   { id: "january", count_order: 5, count_indent: 10 },
  //   { id: "february", count_order: 80, count_indent: 100 },
  //   { id: "macrh", count_order: 15, count_indent: 30 },
  //   { id: "april", count_order: 30, count_indent: 80 },
  // ]
  // chart03 = [
  //   { id: "january", count: 80 },
  //   { id: "february", count: 20 },
  //   { id: "macrh", count: 60 },
  //   { id: "april", count: 90 },
  // ];
  // chart04 = [
  //   { id: "january", count: 10 },
  //   { id: "february", count: 80 },
  //   { id: "macrh", count: 30 },
  //   { id: "april", count: 90 },
  // ];


  constructor(private chartService: DashboardService, private config: ConfigService, public menuCtrl: MenuController
  ) {
    this.chartService.getOrderArea(this.chart1Request);
    this.chartService.getSuccessfullIndent(this.chart2Request);
    this.chartService.getOrderOpen(this.chart3Request);
    this.chartService.getOrderCancel(this.chart4Request)

    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    // this.menuCtrl.enable(false);
  }

  selectedChart1(chartType) {
    this.selectedChart1Value = chartType
    let chart = chartType.charAt(0).toLowerCase() + chartType.slice(1);;
    this.chartType1 = chart
  }
  selectedChart2(chartType) {
    let chart = chartType.charAt(0).toLowerCase() + chartType.slice(1);;
    this.chartType2 = chart
  }
  selectedChart3(chartType) {
    let chart = chartType.charAt(0).toLowerCase() + chartType.slice(1);;
    this.chartType3 = chart
  }
  selectedChart4(chartType) {
    let chart = chartType.charAt(0).toLowerCase() + chartType.slice(1);;
    this.chartType4 = chart
  }
  selectedChart2Period(periodType) {
    let period = periodType.charAt(0).toLowerCase() + periodType.slice(1);;
    this.chart2Request.period = period
    this.chartService.getSuccessfullIndent(this.chart2Request).then(data => {
    })
  }
  selectedChart3Period(periodType) {
    let period = periodType.charAt(0).toLowerCase() + periodType.slice(1);;
    this.chart3Request.period = period;
    this.chartService.getOrderOpen(this.chart3Request).then(data => { })
  }
  selectedChart4Period(periodType) {
    let period = periodType.charAt(0).toLowerCase() + periodType.slice(1);;
    this.chart4Request.period = period
    this.chartService.getOrderCancel(this.chart4Request).then(data => { })
  }
  selectedChart4Agency(agency) {
    let period = agency.charAt(0).toLowerCase() + agency.slice(1);;
    this.chart4Request.agency = period;
    this.chartService.getOrderCancel(this.chart4Request).then(data => { })
  }

  ngOnInit() {
    this.chartService._orderArea$.subscribe((chart1data: any[]) => {
      if (chart1data.length > 0) {
        this.chartLabels1 = []
        this.chartData1 = []
        for (let i = 0; i < chart1data.length; i++) {
          this.chartLabels1[i] = chart1data[i]._id
          this.chartData1[i] = chart1data[i].count;
        }
      }
    })

    this.chartService._successfullIndent$.subscribe((chart2data: any) => {
      if (chart2data.length > 0) {
        this.chartLabels2 = []
        this.chartData2[0].data = []
        this.chartData2[1].data = []
        for (let i = 0; i < chart2data.length; i++) {
          this.chartLabels2[i] = chart2data[i]._id
          this.chartData2[0].data[i] = chart2data[i].successful_indents;
          this.chartData2[1].data[i] = chart2data[i].total_indents;
        }
      }
    })
    this.chartService._orderOpen$.subscribe(chart3data => {
      if (chart3data.length > 0) {
        this.chartLabels3 = []
        this.chartData3 = []
        for (let i = 0; i < chart3data.length; i++) {
          this.chartLabels3[i] = chart3data[i]._id
          this.chartData3[i] = chart3data[i].open_count;
        }
      }
    })
    this.chartService._orderCancel$.subscribe(chart4data => {
      if (chart4data.length > 0) {
        this.chartLabels4 = []
        this.chartData4 = []
        for (let i = 0; i < chart4data.length; i++) {
          this.chartLabels4[i] = chart4data[i]._id
          this.chartData4[i] = chart4data[i].cancelled_count;
        }
      }
    })
    this.config._listAgency$.subscribe(data => {
      this.chartOptionToSelectAgency = ['All']
      data.forEach(element => {
        return this.chartOptionToSelectAgency.push(element.agency_name);
      });

      console.log("agency list", this.chartOptionToSelectAgency)
    })

  }


}