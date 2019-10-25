<template>
    <div ref='schem' class="image-box">
      <img :src="schematicSource"  style="width:100%;height:100%;"  alt=""> 
      <!-- <div  v-for="(value, propertyName) in points" :key="propertyName">{{propertyName}} : {{value}}</div> -->
      <v-avatar  v-for="(value, propertyName) in points" :key="propertyName" class="schem-btn" flat 
        :ref="propertyName">
        <img v-if="value.color==20" :src="red" alt=""> 
        <img v-else-if="value.color==10" :src="orange" alt="">
        <img v-else :src="green" alt="">
      </v-avatar>
    </div>
</template>
<script>

  export default {
    name: "Schematic",
    components: {
    },
    props: {
        schematicSource: String,
        points: Object,        
        initWidth: Number,
        initHeight: Number,
        // idName: String,
        active:Boolean
    }, 
    data: function() {
      return {   
        red:require('../assets/diagRed_light.png'),
        orange:require('../assets/diagOrange_light.png'),
        green:require('../assets/diagGreen_light.png'),
        currEvents:[],
        cssHeight:'100%',
        cssWidth:'100%'        
      };
    },
    created()
    {
      if (this.initWidth>this.initHeight) this.cssWidth='auto';
      else this.cssHeight = 'auto';
    },
    mounted() {

        var image = this.$refs['schem'];
        var height = image.clientHeight;
        var width = image.clientWidth;

        for(let i=0;i< Object.keys(this.points).length;i++)
        {
            let key = Object.keys(this.points)[i]

            this.$refs[key][0].style.top = ((this.points[key].y*height)/this.initHeight)+image.offsetTop+"px";
            this.$refs[key][0].style.left = ((this.points[key].x*width)/this.initWidth)+image.offsetLeft+"px";
        }

        window.addEventListener('resize', this.onResize);    
    }, 
    watch:
    {
      active:function()
      {

        if (this.active)
        {
          setTimeout(() => {
            this.calcPositions();
          }); 

        }
      }
    },    
    methods: {
      onResize()
      {     
        this.calcPositions();       
      },
      calcPositions: function()
      {
        
        var image = this.$refs['schem'];
        var height = image.clientHeight;
        var width = image.clientWidth;

        for(let i=0;i< Object.keys(this.points).length;i++)
        {
            let key = Object.keys(this.points)[i]

            this.$refs[key][0].style.top = ((this.points[key].y*height)/this.initHeight)+image.offsetTop+"px";
            this.$refs[key][0].style.left = ((this.points[key].x*width)/this.initWidth)+image.offsetLeft+"px";

        }

      }
    },
  };
</script>
<style>
  .image-box {
    height: 100%;
    width: 100%;  
  }  
  .schem
  {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .schem-btn
  {
    position: absolute !important;
    height: 25px;
    width: 25px;
  }
</style>
