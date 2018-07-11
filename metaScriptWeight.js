//Save the timestamp
let timestampMetaWeight = "";
//Save of all file data
let metaWeightdata =[];

let beginThreshold = 0.0;
let endThreshold = 2.5;

//Creating datasets
let precisionWeightDataset =
    {
        label: 'Precision',
        //backgroundColor: "#36a2eb",
        //borderColor: "#000000",
        borderColor: "#36a2eb",
        //borderWidth: 1,
        borderWidth: 2,
        yAxisID:"perf",
        data: []
    };

let recallWeightDataset = {
    label: 'Recall',
    //backgroundColor: "#f1f442",
    //borderColor: "#000000",
    borderColor: "#f1f442",
    //borderWidth: 1,
    borderWidth: 2,
    yAxisID:"perf",
    data: []
};

let fscoreWeightDataset = {
    label: 'F-Score',
    //backgroundColor: "#ff6384",
    //borderColor: "#000000",
    borderColor: "#ff6384",
    //borderWidth: 1,
    borderWidth: 2,
    yAxisID:"perf",
    data: []
};

let meanRankrealPositivesQuotientWeightDataset = {
    label: 'MeanRankRealPositivesQuotient',
    //backgroundColor: "#ff8216",
    //borderColor: "#000000",
    borderColor: "#ff8216",
    //borderWidth: 1,
    borderWidth: 2,
    yAxisID:"meanRank",
    data: []
};

let barChartWeightData =
    {
        labels: [],
        datasets: [ precisionWeightDataset, recallWeightDataset, fscoreWeightDataset, meanRankrealPositivesQuotientWeightDataset]
    };

window.addEventListener("load", function()
{
    let ctxMetaWeight = document.getElementById('canvasMetaWeight').getContext('2d');
    window.myBarMetaWeight = new Chart(ctxMetaWeight, {
        type: 'line',
        data: barChartWeightData,
        options:
            {
                responsive: true,
                legend: {position: 'top'},
                title:
                    {
                        display: true,
                        text: 'Performances computed by Threshold - '+timestampMetaWeight
                    },
                scales: {
                    yAxes:
                        [
                            {
                                label:"Performance",
                                id: 'perf',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    steps: 10,
                                    stepValue: 0.1,
                                    max: 1
                                },
                                scaleLabel:{
                                    labelString:"Performance",
                                    display:true,
                                    fontSize:16,
                                    fontColor:"#666",
                                    fontStyle:"bold"
                                }
                            },
                            {
                                label:"MeanRank",
                                id: 'meanRank',
                                type: 'linear',
                                position: 'right',
                                scaleLabel:{
                                    labelString:"MeanRank",
                                    display:true,
                                    fontSize:16,
                                    fontColor:"#666",
                                    fontStyle:"bold"
                                }
                            }
                        ],
                    xAxes:
                        [
                            {
                                label:"Threshold",
                                scaleLabel:{
                                    labelString:"Threshold",
                                    display:true,
                                    fontSize:16,
                                    fontColor:"#666",
                                    fontStyle:"bold"
                                }
                            }
                        ]
                }
            }
    });

    document.getElementById("showAllMetaWeight").addEventListener("click",
        () =>
        {
            if(precisionWeightDataset.data.length !== 0)
            {
                barChartWeightData.datasets=[ precisionWeightDataset, recallWeightDataset, fscoreWeightDataset, meanRankrealPositivesQuotientWeightDataset];
                window.myBarMetaWeight.update();
            }
        }
    );

    document.getElementById("addRemovePrecisionMetaWeight").addEventListener("click",
        () =>
        {
            console.log("hello");
            if(precisionWeightDataset.data.length !== 0)
            {
                console.log("hello2");
                let indexOfprecisionWeightDataset = barChartWeightData.datasets.map(x => x.label).indexOf("Precision");
                if(indexOfprecisionWeightDataset === -1)
                {
                    barChartWeightData.datasets.push(precisionWeightDataset);
                }
                else
                {
                    barChartWeightData.datasets.splice(indexOfprecisionWeightDataset, 1);
                }
                window.myBarMetaWeight.update();
            }
        }
    );

    document.getElementById("addRemoveRecallMetaWeight").addEventListener("click",
        () =>
        {
            if(precisionWeightDataset.data.length !== 0)
            {
                let indexOfrecallWeightDataset = barChartWeightData.datasets.map(x => x.label).indexOf("Recall");
                if(indexOfrecallWeightDataset === -1)
                {
                    barChartWeightData.datasets.push(recallWeightDataset);
                }
                else
                {
                    barChartWeightData.datasets.splice(indexOfrecallWeightDataset, 1);
                }
                window.myBarMetaWeight.update();
            }
        }
    );

    document.getElementById("addRemoveFscoreMetaWeight").addEventListener("click",
        () =>
        {
            if(precisionWeightDataset.data.length !== 0)
            {
                let indexOffscoreWeightDataset = barChartWeightData.datasets.map(x => x.label).indexOf("F-Score");
                if(indexOffscoreWeightDataset === -1)
                {
                    barChartWeightData.datasets.push(fscoreWeightDataset);
                }
                else
                {
                    barChartWeightData.datasets.splice(indexOffscoreWeightDataset, 1);
                }
                window.myBarMetaWeight.update();
            }
        }
    );

    document.getElementById("addRemoveMeanRankRealPositivesQuotientMetaWeight").addEventListener("click",
        () =>
        {
            if(precisionWeightDataset.data.length !== 0)
            {
                let indexOfmeanRankrealPositivesQuotientWeightDataset = barChartWeightData.datasets.map(x => x.label).indexOf("MeanRankRealPositivesQuotient");
                if(indexOfmeanRankrealPositivesQuotientWeightDataset === -1)
                {
                    barChartWeightData.datasets.push(meanRankrealPositivesQuotientWeightDataset);
                }
                else
                {
                    barChartWeightData.datasets.splice(indexOfmeanRankrealPositivesQuotientWeightDataset, 1);
                }
                window.myBarMetaWeight.update();
            }
        }
    );


    document.getElementById('loadMetaWeightResults').addEventListener(
        'change',
        evt =>
        {
            let files = evt.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event =>
            {
                metaWeightdata = JSON.parse(event.target.result);

                //Best informations
                document.getElementById("precisionMetaWeightValue").textContent = metaWeightdata.bestThreshold.Precision;
                document.getElementById("recallMetaWeightValue").textContent = metaWeightdata.bestThreshold.Recall;
                document.getElementById("fscoreMetaWeightValue").textContent = metaWeightdata.bestThreshold.F_Score;
                document.getElementById("meanRankRealPositivesMetaWeightValue").textContent = metaWeightdata.bestThreshold.MeanRankRealPositives;

                let thresholds = metaWeightdata.perThreshold.sort((a, b) => a.Threshold - b.Threshold);

                //Data processing:
                let newDataPrecision = [];
                let newDataRecall = [];
                let newDataFScore = [];
                let newDataMeanRankRealPositivesQuotient = [];

                for(let i = 0; i< thresholds.length; i++)
                {
                    let actualThreshold = thresholds[i];
                    //Change the label
                    barChartWeightData.labels.push(actualThreshold.Threshold);

                    newDataPrecision[i] = actualThreshold.Precision;
                    newDataRecall[i] = actualThreshold.Recall;
                    newDataFScore[i] = actualThreshold.F_Score;
                    newDataMeanRankRealPositivesQuotient[i] = actualThreshold.MeanRankRealPositives / actualThreshold.MeanNumberOfRelatedEntitiesFound;
                    console.log(actualThreshold.MeanRankRealPositives);
                    console.log(actualThreshold.MeanNumberOfRelatedEntitiesFound);
                    console.log(newDataMeanRankRealPositivesQuotient[i]);
                }



                //Create bars
                precisionWeightDataset.data = newDataPrecision;
                recallWeightDataset.data = newDataRecall;
                fscoreWeightDataset.data = newDataFScore;
                meanRankrealPositivesQuotientWeightDataset.data = newDataMeanRankRealPositivesQuotient;

                barChartWeightData.datasets=[ precisionWeightDataset, recallWeightDataset, fscoreWeightDataset, meanRankrealPositivesQuotientWeightDataset,  numberOfDiseasesDataSet ];

                timestamp = metaWeightdata.bestThreshold.TimeStamp;

                window.myBarMetaWeight.update();


            };
            reader.readAsText(file)
        },
        false);

    document.getElementById('beginThreshold').addEventListener(
        'change',
        () =>
            {
                beginThreshold = Number(document.getElementById('beginThreshold').value);

                //Data processing:
                let newDataPrecision = [];
                let newDataRecall = [];
                let newDataFScore = [];
                let newDataMeanRankRealPositivesQuotient = [];

                let thresholds = metaWeightdata.perThreshold.filter(a => a.Threshold >= beginThreshold && a.Threshold <= endThreshold);

                barChartWeightData.labels = [];
                for(let i = 0; i< thresholds.length; i++)
                {
                    let actualThreshold = thresholds[i];
                    //Change the label
                    barChartWeightData.labels.push(actualThreshold.Threshold);

                    newDataPrecision[i] = actualThreshold.Precision;
                    newDataRecall[i] = actualThreshold.Recall;
                    newDataFScore[i] = actualThreshold.F_Score;
                    newDataMeanRankRealPositivesQuotient[i] = actualThreshold.MeanRankRealPositives / actualThreshold.MeanNumberOfRelatedEntitiesFound;
                }



                //Create bars
                precisionWeightDataset.data = newDataPrecision;
                recallWeightDataset.data = newDataRecall;
                fscoreWeightDataset.data = newDataFScore;
                meanRankrealPositivesQuotientWeightDataset.data = newDataMeanRankRealPositivesQuotient;

                barChartWeightData.datasets=[ precisionWeightDataset, recallWeightDataset, fscoreWeightDataset, meanRankrealPositivesQuotientWeightDataset,  numberOfDiseasesDataSet ];

                timestamp = metaWeightdata.bestThreshold.TimeStamp;

                window.myBarMetaWeight.update();
            }
        );

    document.getElementById('endThreshold').addEventListener(
        'change',
        () =>
        {
            endThreshold = Number(document.getElementById('endThreshold').value);

            //Data processing:
            let newDataPrecision = [];
            let newDataRecall = [];
            let newDataFScore = [];
            let newDataMeanRankRealPositivesQuotient = [];

            let thresholds = metaWeightdata.perThreshold.filter(a => a.Threshold >= beginThreshold && a.Threshold <= endThreshold);

            barChartWeightData.labels = [];
            for(let i = 0; i< thresholds.length; i++)
            {
                let actualThreshold = thresholds[i];
                //Change the label
                barChartWeightData.labels.push(actualThreshold.Threshold);

                newDataPrecision[i] = actualThreshold.Precision;
                newDataRecall[i] = actualThreshold.Recall;
                newDataFScore[i] = actualThreshold.F_Score;
                newDataMeanRankRealPositivesQuotient[i] = actualThreshold.MeanRankRealPositives / actualThreshold.MeanNumberOfRelatedEntitiesFound;
            }



            //Create bars
            precisionWeightDataset.data = newDataPrecision;
            recallWeightDataset.data = newDataRecall;
            fscoreWeightDataset.data = newDataFScore;
            meanRankrealPositivesQuotientWeightDataset.data = newDataMeanRankRealPositivesQuotient;

            barChartWeightData.datasets=[ precisionWeightDataset, recallWeightDataset, fscoreWeightDataset, meanRankrealPositivesQuotientWeightDataset,  numberOfDiseasesDataSet ];

            timestamp = metaWeightdata.bestThreshold.TimeStamp;

            window.myBarMetaWeight.update();
        }
    );

});

