//Save of all file data
let metadata =[];

//Creating datasets
let metaDataset =
    {
        label: 'NormalizedMeanRank',
        //backgroundColor: "#c2d6eb",

        borderColor: "#3b31eb",
        borderWidth: 1,
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(153, 102, 155, 0.2)",
        pointHoverBorderColor: "rgba(153, 102, 155, 1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data:[]
    };

let bubbleChartData =
    {
        xLabels: [],
        yLabels: [],
        datasets: [metaDataset]
    };

let coeff = 20.0;
let meanNumberRelatedEntities = 0;

window.addEventListener("load", function()
{
    let ctxMeta = document.getElementById('canvasMeta').getContext('2d');

    window.myMetaBubbleChart = new Chart(ctxMeta, {
        type: 'bubble',
        data: bubbleChartData,
        options:
            {
                responsive: true,
                legend: {position: 'top'},
                title:
                    {
                        display: true,
                        text: 'Performances computed by Formula'
                    },
                tooltips: {
                    mode: 'index',
                    callbacks: {
                        // Use the footer callback to display the result of a function
                        footer:
                            (tooltipItems, data) =>
                            {
                                let meanRank = 0.0;

                                tooltipItems.forEach(
                                    (tooltipItem) =>
                                    {
                                        meanRank = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].value;
                                    });
                                return "MeanRank: " + meanRank;
                            },
                        afterFooter:
                            (tooltipItems, data) =>
                            {
                                let SD = 0.0;

                                tooltipItems.forEach(
                                    (tooltipItem) =>
                                    {
                                        SD = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].standartDeviation;
                                    });
                                return "Standard Deviation: "+ SD;
                            }
                    },
                    footerFontStyle: 'normal'
                },
                scales: {
                    xAxes: [
                            {
                                type: 'category',
                                position: 'bottom',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Term frequency'
                                }
                            }
                            ],
                    yAxes: [
                            {
                                type: 'category',
                                position: 'left',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'IDF'
                                }
                            }
                            ]
                },
                elements: {
                    point: {
                        radius: function(context) {
                            let value = context.dataset.data[context.dataIndex].value;
                            let size = context.chart.width;
                            let base = Math.abs(value) / 1500;
                            return (size / 24) * base;
                        },
                        backgroundColor:(context) =>
                        {
                            let index = context.dataIndex;
                            let myData = context.dataset.data;
                            let value = myData[index].standartDeviation;

                            let oldMinValue = Math.min.apply(null, myData.map(data=> data.value));
                            let oldMaxValue = Math.max.apply(null, myData.map(data=> data.value));

                            let newMinValue = 0.0;
                            let newMaxValue = 1.0;

                            //Normalization
                            let newValue = newMinValue + (value - oldMinValue)*(newMaxValue - newMinValue ) / (oldMaxValue - oldMinValue);

                            //Transform to color code
                            return getGradientColor('#000099', '#ff0000', newValue);
                        }
                    }
                }
            }
    });

    document.getElementById('loadMetaResults').addEventListener(
        'change',
        evt =>
        {
            let files = evt.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event =>
            {
                metadata = JSON.parse(event.target.result);

                //Best infos
                document.getElementById("precisionValueMeta").textContent = metadata.bestInfos.Precision;
                document.getElementById("recallValueMeta").textContent = metadata.bestInfos.Recall;
                document.getElementById("fscoreValueMeta").textContent = metadata.bestInfos.F_Score;
                document.getElementById("rangMoyenMeta").textContent = metadata.bestInfos.MeanRankRealPositives;
                document.getElementById("ecartTypeRangMeta").textContent = metadata.bestInfos.StandardDeviationRankRealPositivesGeneral;


                meanNumberRelatedEntities = metadata.bestInfos.MeanNumberOfRelatedEntitiesFound;


                //Find TF classes
                let tfClasses = [];
                tfClasses = metadata.perCombinaison.map(x => x.TFType);
                tfClasses = tfClasses.filter((item, pos) => tfClasses.indexOf(item) === pos).sort();//Enlever doublons
                //tfClasses = tfClasses.map((elem, index) => elem.toUpperCase());

                //Find IDF classes
                let idfClasses = [];
                idfClasses = metadata.perCombinaison.map(x => x.IDFType);
                idfClasses = idfClasses.filter((item, pos) => idfClasses.indexOf(item) === pos).sort();//Enlever doublons

                //Update my data
                bubbleChartData.xLabels = tfClasses;
                bubbleChartData.yLabels = idfClasses;



                //Data processing:
                let newMetaDataset = [];

                metadata.perCombinaison.forEach(
                    pc =>
                    {
                        let elem = {
                            x: pc.TFType,
                            y: pc.IDFType,
                            //r: coeff * pc.MeanRankRealPositives / pc.MeanNumberOfRelatedEntitiesFound,
                            value: pc.MeanRankRealPositives,
                            standartDeviation: pc.StandardDeviationRankRealPositivesGeneral
                        };
                        newMetaDataset.push(elem);
                    }
                );



                //Create bubbles
                metaDataset.data = newMetaDataset;

                //console.log("Dernière donnée: ");
                //console.log(metaDataset.data[metaDataset.data.length - 1]);
                //metaDataset.data = metaDataset.data.slice(0, metaDataset.data.length - 1);

                bubbleChartData.datasets=[metaDataset];

                window.myMetaBubbleChart.update();
            };
            reader.readAsText(file);
        },
        false);

});

let getGradientColor = function(start_color, end_color, percent) {
    // strip the leading # if it's there
    start_color = start_color.replace(/^\s*#|\s*$/g, '');
    end_color = end_color.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(start_color.length === 3){
        start_color = start_color.replace(/(.)/g, '$1$1');
    }

    if(end_color.length === 3){
        end_color = end_color.replace(/(.)/g, '$1$1');
    }

    // get colors
    let start_red = parseInt(start_color.substr(0, 2), 16),
        start_green = parseInt(start_color.substr(2, 2), 16),
        start_blue = parseInt(start_color.substr(4, 2), 16);

    let end_red = parseInt(end_color.substr(0, 2), 16),
        end_green = parseInt(end_color.substr(2, 2), 16),
        end_blue = parseInt(end_color.substr(4, 2), 16);

    // calculate new color
    let diff_red = end_red - start_red;
    let diff_green = end_green - start_green;
    let diff_blue = end_blue - start_blue;

    diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
    diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
    diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

    // ensure 2 digits by color
    if( diff_red.length === 1 ) diff_red = '0' + diff_red;
    if( diff_green.length === 1 ) diff_green = '0' + diff_green;
    if( diff_blue.length === 1 ) diff_blue = '0' + diff_blue;

    return '#' + diff_red + diff_green + diff_blue;
};

