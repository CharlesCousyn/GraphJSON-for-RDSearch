//Save of all file data
let metadata =[];

//Creating datasets
let metaDataset =
    {
        label: 'NormalizedMeanRank',
        //backgroundColor: "#c2d6eb",
        backgroundColor:(context) =>
        {
            let index = context.dataIndex;
            let myData = context.dataset.data;
            let value = myData[index].r;
            let minValue = Math.min.apply(null, myData.map(data=> data.r));

            return minValue !== value ? "#c2d6eb" : 'red';
        },
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

window.onload = function()
{
    let ctx = document.getElementById('canvasMeta').getContext('2d');
    window.myMetaBubbleChart = new Chart(ctx, {
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
                        // Use the footer callback to display the sum of the items showing in the tooltip
                        footer:
                            (tooltipItems, data) =>
                            {
                                let meanRank = 0;

                                tooltipItems.forEach(
                                    (tooltipItem) =>
                                    {
                                        meanRank =
                                            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].r *
                                            meanNumberRelatedEntities / coeff;
                                        //meanRank = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].r;
                                        //meanRank = meanNumberRelatedEntities;
                                        //meanRank = 12;
                                    });
                                return 'MeanRank: ' + meanRank;
                            },
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
                            r: coeff * pc.MeanRankRealPositives / pc.MeanNumberOfRelatedEntitiesFound
                        };
                        newMetaDataset.push(elem);
                    }
                );



                //Create bubbles
                metaDataset.data = newMetaDataset;
                /*
                console.log("Dernière donnée: ");
                console.log(metaDataset.data[metaDataset.data.length - 1]);
                metaDataset.data = metaDataset.data.slice(0, metaDataset.data.length - 1);*/

                bubbleChartData.datasets=[metaDataset];

                window.myMetaBubbleChart.update();
            };
            reader.readAsText(file);
        },
        false);

};

