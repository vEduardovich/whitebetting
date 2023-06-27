import gameAPI from '@/commons/gameAPI';
const GameAPI = new gameAPI();

const mixinDataAnal = {

  methods: {
    dataAnalysis(what) {
      GameAPI.dataAnalysis(what);
    },
    deleteHelloDom() {
      document.getElementById('hello').style.display = 'none';
      document.getElementById('helloTxt').style.display = 'none';      
    }
  },

}

export default mixinDataAnal;
