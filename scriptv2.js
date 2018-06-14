//Save the timestamp
let timestamp = "";
//Save of all file data
let data =[];

//Creating datasets
let precisionDataset =
    {
        label: 'Precision',
        backgroundColor: "#36a2eb",
        borderColor: "#000000",
        borderWidth: 1,
        yAxisID:"perf",
        data: []
    };

let recallDataset = {
    label: 'Recall',
    backgroundColor: "#f1f442",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"perf",
    data: []
};

let fscoreDataset = {
    label: 'F-Score',
    backgroundColor: "#ff6384",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"perf",
    data: []
};

let meanRankrealPositivesQuotientDataset = {
    label: 'MeanRankRealPositivesQuotient',
    backgroundColor: "#ff8216",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"perf",
    data: []
};

let numberOfDiseasesDataSet = {
    label: 'Number of diseases',
    backgroundColor: "#53eb3d",
    borderColor: "#000000",
    borderWidth: 1,
    yAxisID:"numberOfDiseases",
    data: []
};

let barChartData =
    {
        labels: [],
        datasets: [ precisionDataset, recallDataset, fscoreDataset, meanRankrealPositivesQuotientDataset, numberOfDiseasesDataSet]
    };

let average = arr => arr.reduce((a,b) => (isNaN(a) || isNaN(b))? 0.0 : a+b, 0.0)/arr.length;

window.addEventListener("load", function()
{
    let ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options:
            {
                responsive: true,
                legend: {position: 'top'},
                title:
                    {
                        display: true,
                        text: 'Performances computed by Disease - '+timestamp
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
                                label:"Number of diseases",
                                id: 'numberOfDiseases',
                                type: 'linear',
                                position: 'right',
                                scaleLabel:{
                                    labelString:"Number of diseases",
                                    display:true,
                                    fontSize:16,
                                    fontColor:"#666",
                                    fontStyle:"bold"
                                }
                            }],
                    xAxes:
                    [
                        {
                            label:"Number of publications",
                            scaleLabel:{
                                labelString:"Number of publications",
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

    document.getElementById("showAll").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                barChartData.datasets=[ precisionDataset, recallDataset, fscoreDataset, meanRankrealPositivesQuotientDataset, numberOfDiseasesDataSet];
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemovePrecision").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfPrecisionDataset = barChartData.datasets.map(x => x.label).indexOf("Precision");
                if(indexOfPrecisionDataset === -1)
                {
                    barChartData.datasets.push(precisionDataset);
                }
                else
                {
                    barChartData.datasets.splice(indexOfPrecisionDataset, 1);
                }
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemoveRecall").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfRecallDataset = barChartData.datasets.map(x => x.label).indexOf("Recall");
                if(indexOfRecallDataset === -1)
                {
                    barChartData.datasets.push(recallDataset);
                }
                else
                {
                    barChartData.datasets.splice(indexOfRecallDataset, 1);
                }
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemoveFscore").addEventListener("click",
        event =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfFscoreDataset = barChartData.datasets.map(x => x.label).indexOf("F-Score");
                if(indexOfFscoreDataset === -1)
                {
                    barChartData.datasets.push(fscoreDataset);
                }
                else
                {
                    barChartData.datasets.splice(indexOfFscoreDataset, 1);
                }
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemoveNumberOfDiseases").addEventListener("click",
        () =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfNumberOfDiseasesDataset = barChartData.datasets.map(x => x.label).indexOf("Number of diseases");
                if(indexOfNumberOfDiseasesDataset === -1)
                {
                    barChartData.datasets.push(numberOfDiseasesDataSet);
                }
                else
                {
                    barChartData.datasets.splice(indexOfNumberOfDiseasesDataset, 1);
                }
                window.myBar.update();
            }
        }
    );

    document.getElementById("addRemoveMeanRankRealPositivesQuotient").addEventListener("click",
        () =>
        {
            if(precisionDataset.length !== 0)
            {
                let indexOfMeanRankRealPositivesQuotientDataset = barChartData.datasets.map(x => x.label).indexOf("MeanRankRealPositivesQuotient");
                if(indexOfMeanRankRealPositivesQuotientDataset === -1)
                {
                    barChartData.datasets.push(meanRankrealPositivesQuotientDataset);
                }
                else
                {
                    barChartData.datasets.splice(indexOfMeanRankRealPositivesQuotientDataset, 1);
                }
                window.myBar.update();
            }
        }
    );


    document.getElementById('loadResults').addEventListener(
        'change',
        evt =>
        {
            let files = evt.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event =>
            {
                data = JSON.parse(event.target.result);

                //General informations
                document.getElementById("precisionValue").textContent = data.general.Precision;
                document.getElementById("recallValue").textContent = data.general.Recall;
                document.getElementById("fscoreValue").textContent = data.general.F_Score;
                document.getElementById("meanRankRealPositivesValue").textContent = data.general.MeanRankRealPositives;
                document.getElementById("meanNumberOfRelatedEntitiesFoundValue").textContent = data.general.MeanNumberOfRelatedEntitiesFound;

                let diseases = data.perDisease;

                //Data processing:
                let newData = [];
                let newDataPrecision = [];
                let newDataRecall = [];
                let newDataFScore = [];
                let newDataMeanRankRealPositivesQuotient = [];
                let newDataNumberOfDiseases = [];

                //x classes
                barChartData.labels=[];
                let sizeBar=  100;
                let numberOfBar = 1000/sizeBar;

                for(let i = 0; i< numberOfBar; i++)
                {
                    //Change the label
                    barChartData.labels.push((i*sizeBar)+"-"+((i+1)*sizeBar));

                    //Find the coresponding elements
                    newData[i] = diseases
                        .filter(x => x.NumberOfPublications >= i*sizeBar && x.NumberOfPublications < (i+1)*sizeBar);
                    //console.log(newData[i].map(x=>x.Precision));
                    newDataPrecision[i] = average(newData[i].map(x=>x.Precision));
                    newDataRecall[i] = average(newData[i].map(x=>x.Recall));
                    newDataFScore[i] = average(newData[i].map(x=>x.F_Score));
                    newDataMeanRankRealPositivesQuotient[i] = average(newData[i].map(x=>x.MeanRankRealPositives / x.NumberOfRelatedEntitiesFound));
                    newDataNumberOfDiseases[i] = newData[i].length;
                }



                //Create bars
                precisionDataset.data = newDataPrecision;
                recallDataset.data = newDataRecall;
                fscoreDataset.data = newDataFScore;
                meanRankrealPositivesQuotientDataset.data = newDataMeanRankRealPositivesQuotient;
                numberOfDiseasesDataSet.data = newDataNumberOfDiseases;

                barChartData.datasets=[ precisionDataset, recallDataset, fscoreDataset, meanRankrealPositivesQuotientDataset,  numberOfDiseasesDataSet ];

                timestamp = data.general.TimeStamp;

                window.myBar.update();


            };
            reader.readAsText(file)
        },
        false);

    document.getElementById('sizeBar').addEventListener(
        'change',
        evt =>
        {
            let value = Number(document.getElementById('sizeBar').value);

            let diseases = data.perDisease;

            //Data processing:
            let newData = [];
            let newDataPrecision = [];
            let newDataRecall = [];
            let newDataFScore = [];
            let newDataMeanRankRealPositivesQuotient = [];
            let newDataNumberOfDiseases = [];

            //x classes
            barChartData.labels=[];
            let sizeBar=  value;
            let numberOfBar = 1000/sizeBar;

            for(let i = 0; i< numberOfBar; i++)
            {
                //Change the label
                barChartData.labels.push((i*sizeBar)+"-"+((i+1)*sizeBar));

                //Find the coresponding elements
                newData[i] = diseases
                    .filter(x => x.NumberOfPublications >= i*sizeBar && x.NumberOfPublications < (i+1)*sizeBar);
                //console.log(newData[i].map(x=>x.Precision));
                newDataPrecision[i] = average(newData[i].map(x=>x.Precision));
                newDataRecall[i] = average(newData[i].map(x=>x.Recall));
                newDataFScore[i] = average(newData[i].map(x=>x.F_Score));
                newDataMeanRankRealPositivesQuotient[i] = average(newData[i].map(x=>x.MeanRankRealPositives / x.NumberOfRelatedEntitiesFound));
                newDataNumberOfDiseases[i] = newData[i].length;
            }



            //Create bars
            precisionDataset.data=newDataPrecision;
            recallDataset.data=newDataRecall;
            fscoreDataset.data=newDataFScore;
            meanRankrealPositivesQuotientDataset.data = newDataMeanRankRealPositivesQuotient;
            numberOfDiseasesDataSet.data = newDataNumberOfDiseases;

            window.myBar.update();
        }
        );

});

