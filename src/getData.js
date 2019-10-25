import axios  from 'axios';
import router from './router'
import {globalStore}            from "./main.js"

//const API_URL = 'http://localhost:8092';
const API_URL_REMOTE = 'http://eds2.propulsionanalytics.com';

export class getData {

    constructor(userProfile){

       // console.log(userProfile);

        this.getFilterAlerts();

        this.getConstants();

        //this.getDashboardData('last');
        //this.getConstantsFromRemote();

        //this.getLastUpdate();
    }

    getFilterAlerts()
    {
        
        if (!window.$cookies.isKey('alertCheck'))  
            axios.get(API_URL_REMOTE+'/rule').then(response => {
                globalStore.alertFilters = response.data;
                window.$cookies.set('alertCheck', true);
            })
    }

    // getConstantsFromRemote()
    // {
    //     axios.get(API_URL_REMOTE+'/GetWiDEData/const/limits').then(response => {
    //         globalStore.limits = JSON.parse(response.data.data.limits);

    //     });

    //     axios.get(API_URL_REMOTE+'/GetWiDEData/const/mapping').then(response => {
    //         globalStore.mapping = JSON.parse(response.data.data.mapping);
    //         globalStore.ehcMapping = JSON.parse(response.data.data.ehcMapping);           
    //     });

    //     axios.get(API_URL_REMOTE+'/GetWiDEData/const/units').then(response => {
    //         globalStore.units =  JSON.parse( response.data.data.units );
    //     });

    //     axios.get(API_URL_REMOTE+'/GetWiDEData/const/loadDiagram').then(response => {
    //         globalStore.loadDiagram = JSON.parse(response.data.data.loadDiagram);
    //     });

    //     axios.get(API_URL_REMOTE+'/GetWiDEChartData').then(response => {
    //       let keys = Object.keys(response.data.data);

    //       for (let i=0;i<keys.length;i++)
    //       {
    //         globalStore.chartData[keys[i]] = JSON.parse(response.data.data[keys[i]]);

    //       }
    //     });
    // }

    getConstants()
    {
        axios.get(API_URL_REMOTE+'/GetWiDEDataWithDashes/const/limits').then(response => {
            globalStore.limits = JSON.parse(response.data.data.limits);

        });

        axios.get(API_URL_REMOTE+'/GetWiDEDataWithDashes/const/mapping').then(response => {
            globalStore.mapping = JSON.parse(response.data.data.mapping);
            globalStore.ehcMapping = JSON.parse(response.data.data.ehcMapping);           
        });

        axios.get(API_URL_REMOTE+'/GetWiDEDataWithDashes/const/faultParameter').then(response => {
            globalStore.faultMapping = JSON.parse(response.data.data.faultParams);
        });

        axios.get(API_URL_REMOTE+'/GetWiDEDataWithDashes/const/units').then(response => {
            globalStore.units =  JSON.parse( response.data.data.units );
        });
        
    }

    getVesselConstants(imo)
    {
        axios.get(API_URL_REMOTE+'/GetWiDEDataWithDashesPerVessel/'+imo+'/const/loadDiagram').then(response => {
            globalStore.loadDiagram = JSON.parse(response.data.data.loadDiagram);
        });

        axios.get(API_URL_REMOTE+'/GetWiDEChartDataPerVessel/'+imo).then(response => {
            let keys = Object.keys(response.data.data);

            for (let i=0;i<keys.length;i++)
            {
                globalStore.chartData[keys[i]] = JSON.parse(response.data.data[keys[i]]);
            }
        });
    }

    getLastUpdate(imo)
    {
        //let url = API_URL+'/GetWiDEData/last';
        //let url_remote = API_URL_REMOTE+'/GetWiDEData/last/';

        this.getDashboardData('last');

        if (globalStore.selectedIMO!='')
        {
            globalStore.type ='';

            this.getFaults('last', imo);
    
            this.getDataFromRemote('last', imo);

        }
        else  globalStore.type = 'last';

    }

    getToday(imo)
    {
        //let url = API_URL+'/GetWiDEData/today';
        //let url_remote = API_URL_REMOTE+'/GetWiDEData/today/';

        this.getDashboardData('today');

        if (globalStore.selectedIMO!='')
        {
            globalStore.type ='';

            this.getFaults('today', imo);

            this.getDataFromRemote('today', imo);
        }
        else  globalStore.type = 'today';
    }

    getDate(date, imo)
    {
        //let url_remote = API_URL_REMOTE+'/GetWiDEDataWithDashes/'+date+'/';

        this.getDashboardData(date);
        
        if (globalStore.selectedIMO!='')
        {
            globalStore.type ='';

            this.getFaults(date, imo);

            this.getDataFromRemote(date, imo);
        }
        else  globalStore.type = date;

    }

    getDataFromRemote(type, imo) {
        
        document.body.style.cursor = 'progress';

        let url = API_URL_REMOTE+ '/GetWiDEDataWithDashesPerVessel/' +imo + '/'+type+'/';

        if ((type=='today') || (type=='last'))
        {
            axios.get(url+'_sig').then(response => {
                globalStore.signals = JSON.parse(response.data.data.sigs);

                this.checkEngineStatus();
            });
        }
            

        axios.get(url+'_ref').then(response => {
            globalStore.reference = JSON.parse(response.data.data.reference);
            globalStore.type = type;
            // var temp = Object.keys(globalStore.signals);

            // if (temp.indexOf('average')>-1)
            //   temp.splice(temp.indexOf('average'),1);
             
            //globalStore.dashboard.date =  temp[temp.length-1];

            document.body.style.cursor = 'default';
        });

    }

    getDashboardData(type)
    {
        globalStore.dashboard={};

        for (let i=0;i<globalStore.userProfile.vessels.length;i++)
        {
            let vessel = globalStore.userProfile.vessels[i];
            
            axios.get(API_URL_REMOTE+'/GetWiDEDataDashboardPerVessel/'+vessel.imo+'/'+type).then(response => {
                
                globalStore.dashboard[vessel.name]= JSON.parse(response.data.data);

                //console.log(globalStore.dashboard[vessel.name]);

                globalStore.dashboard[vessel.name].date = new Date().toISOString();

               // console.log(new Date().toISOString());

                if (Object.keys(globalStore.dashboard[vessel.name]).includes('15days'))
                {
                    globalStore.mapData[vessel.name] = globalStore.dashboard[vessel.name]['15days'];
                }

            });

        }
           

    }

    getFaults(type, imo)
    {
        axios.get(API_URL_REMOTE+'/GetWiDEFaultDataPerVessel/'+imo+'/'+type).then(response => {
            
            if (Object.keys(response.data.data).includes('faults'))
            {

                let faultDict = JSON.parse(response.data.data.faults);
                
                globalStore.faults = Object.values(faultDict).map(function (item) {
                    return JSON.parse(item);
                });
            }
            else globalStore.faults = [];
        });   


        // axios.get(API_URL_REMOTE+'/fault/fakeFaults').then(response => {

        //     globalStore.faults = JSON.parse(response.data).aggrEvents;
        //   });
    }

    // getData(url)
    // {
    //    axios.get(url+'_sig').then(response => {
    //         globalStore.signals = JSON.parse(response.data.sigs);
    //     });


    //     axios.get(url+'_ref').then(response => {
    //         globalStore.reference = JSON.parse(response.data.reference);
    //     });

    // }

    checkDate(date,imo)
    {
        document.body.style.cursor = 'progress';

        globalStore.checkedDate = false;
        globalStore.validDate = false;

        if (imo=='')
        {
            // console.log('check dashboard');

            // axios.get(API_URL_REMOTE+'/GetWiDEDataDashboardPerVessel/'+imo+'/'+date).then(response => {
                
            //     globalStore.validDate = true;
            //     globalStore.checkedDate = true;
            //     document.body.style.cursor = 'default';
            // })
            // .catch(error => {
            //     globalStore.validDate = false;
            //     globalStore.checkedDate = true;
            //     document.body.style.cursor = 'default';
            // });

            
                globalStore.validDate = true;
                globalStore.checkedDate = true;
                document.body.style.cursor = 'default';


        }
        else
        {
            axios.get(API_URL_REMOTE+ '/GetWiDEDataWithDashesPerVessel/' +imo + '/' +date+'/'+'_sig')
            .then(response => {
                globalStore.signals = JSON.parse(response.data.data.sigs);
                this.checkEngineStatus();

                globalStore.validDate = true;
                globalStore.checkedDate = true;
                document.body.style.cursor = 'default';
            })
            .catch(error => {
                globalStore.validDate = false;
                globalStore.checkedDate = true;
                document.body.style.cursor = 'default';
            });
        }        
    }

    checkEngineStatus()
    {
        var temp = Object.keys(globalStore.signals);

        let timestamp = temp[temp.length-1];
 
        let stateText = globalStore.signals[timestamp]['engineStateText'];

        if (stateText==undefined)
        {
            if (globalStore.signals[timestamp]['engineState']==-1000) router.push( { path:  'dashboard'} );
        }
        else
        {
            if ((stateText!='Running')&&(stateText!='Slowdown')) router.push( { path:  'dashboard'} );
        }

    }



}
