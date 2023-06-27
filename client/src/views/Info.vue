<template>
  <div class='infoPage'>
    <v-layout row wrap  >
      <v-flex xs12 lg2>
        <img src='https://whitebetting.s3.amazonaws.com/game/logo/favicon.svg' class='mt-3' alt="wB" title="wB" width='100' height='62'/>
      </v-flex>
      <v-flex xs12 lg4>
        <h1 class='mt-1 grey--text text--darken-1' v-bind:class="{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp}">{{pageName}}</h1>
      </v-flex>
    </v-layout>

    <!-- 하단 내용 -->
    <v-layout column wrap class='mt-4 mx-1' v-bind:class="[{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp }]">
      <v-flex xs12 lg8 text-xs-left>
        <article class='grey--text text--darken-3'>
          <div v-html='msgCategory.tag' >
          </div>
        </article>

      </v-flex>
    </v-layout>

    <v-layout v-show=false row wrap class='mt-2 ml-1 mb-2 gameItem' v-bind:class="[{'mt-5 ': $vuetify.breakpoint.lgAndUp }]">
      <v-flex xs12 lg8>
        <v-layout row wrap>
          <v-flex >
            <router-link v-bind:to='{path:`/info/howtobet`}' title='How to bet' class='grey--text text--darken-1 mb-1  infoCategory' v-bind:class="[ {'selectedCategory' : this.pageNumber == 1}]"  outline >How to bet
            </router-link>
          </v-flex>
          <v-flex ><router-link v-bind:to='{path:`/info/aboutwb`}' title='About wB' class='grey--text text--darken-1 mb-1  infoCategory' v-bind:class="[ {'selectedCategory' : this.pageNumber == 2} ]"  outline >About wB
            </router-link>
          </v-flex>

          <v-flex ><router-link v-bind:to='{path:`/info/contactus`}' title='Contact us' class='grey--text text--darken-1 mb-1  infoCategory' v-bind:class="[ {'selectedCategory' : this.pageNumber == 3} ]"  outline >Contact us
            </router-link>
          </v-flex>

          <v-flex >
            <router-link v-bind:to='{path:`/info/diary`}' title='Diary' class='grey--text text--darken-1 mb-1  infoCategory' v-bind:class="[ {'selectedCategory' : this.pageNumber == 4} ]"  outline >Diary
            </router-link>
          </v-flex>
          <!-- <v-flex >
            <router-link v-bind:to='{path:`/info/privacypolicy`}' title='Privacy Policy' class='grey--text text--darken-1 mb-1  infoCategory' v-bind:class="[ {'selectedCategory' : this.pageNumber == 6} ]"  outline >Privacy Policy
            </router-link>
          </v-flex>                                        -->
          <v-flex >
            <router-link v-bind:to='{path:`/info/termsofservice`}' title='Terms of service' class='grey--text text--darken-1 mb-1  infoCategory' v-bind:class="[ {'selectedCategory' : this.pageNumber == 5} ]"  outline >Terms of service
            </router-link>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>



		<!-- adding loading icon -->
		<!-- <Loading v-if='loadingStatus'/> -->

  </div>
</template>

<script>
import util from '@/commons/util';
const Util    = new util();
import { mapState } from 'vuex'
import mixinDataAnal from '@/commons/mixinDataAnal';
// import Loading from '@/components/Loading'
const isMobile = (window.innerWidth < 1264) ? true : false;
const htmlEl = [
  {tag : ``},
  // 1. How to bet
  {tag : `

  `},
  // 2. About wB
  {tag : `
    <ul><li>Hello! We are WhiteBetting.</li>
      <li class='mt-3'>WhiteBetting is the whitest betting system in the World.</li>
      <li>This is based on the smart contacts in the ethereum blockchain. So betting and settlement are carried out in a manner in which
        <a href='https://etherscan.io/address/0x07859fec7b937c695f1f807255cfc4a13c7b7138#code' target='_blank' title='View on Etherscan' > <span style='text-decoration: underline;'>source code</span>
          <i data-v-abb9de30="" aria-hidden="true" class="v-icon material-icons theme--light" style="transform: rotate(180deg);font-size: 24px; color: rgb(144, 202, 249);  text-decoration:normal;">transit_enterexit</i>
        </a>
        is released. Therefore, once promised, betting information cannot be modified from the source and rewards can be made unconditionally according to the betting result.
      </li>
      <li class='mt-3'>This depends on Vuetify, Truffle, Web3, NginX, Nodejs, MongoDB, EC2, S3</li>
    </ul>

  `},
  // 3. Contact us
  {tag : `
  <ul>
    <li >You can contact us in many ways. We will pleasure you leave a message.</li>
      <li class='mt-1 ml-4'><img src='https://whitebetting.s3.amazonaws.com/game/logo/wb_qr_grey.svg' width='120' height='120'/></li>
      <li class='mt-2 ml-3'><a href='mailto:ufo@whitebetting.com' class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>ufo@whitebetting.com</a></li>
      <li class='mt-2 ml-3'><a href="https://t.me/whitebettingOfficial" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>Telegram</a></li>
      <li class='mt-2 ml-3'><a href="https://etherscan.io/address/0x07859fec7b937c695f1f807255cfc4a13c7b7138" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>Etherscan.io</a></li>
      <li class='mt-2 ml-3'><a href="https://dappradar.com/app/1686/whitebetting" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>Dapp Radar</a></li>
      <li class='mt-2 ml-3'><a href="https://www.stateofthedapps.com/dapps/whitebetting" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>State of the DApps</a></li>
      <li class='mt-2 ml-3'><a href="https://www.dapp.com/dapp/whitebetting" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>Dapp.com</a></li>
      <li class='mt-2 ml-3'><a href="https://dapp.review/dapp/12202" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>Dapp.Review</a></li>

      <!-- https://github.com/WhiteBetting , https://www.youtube.com/channel/UC5BS0mThGNdzcFJ839RnlqQ

      <li class='mt-2 ml-3'><a href="https://trustwallet.com/" target="_blank" class='blue--text text--darken-3 ml-2'>Trust Wallet</a></li>
      <li class='mt-2 ml-3'><a href="https://metamask.io/" target="_blank" class='blue--text text--darken-3 ml-2'>MetaMask</a></li>
      <li class='mt-2 ml-3'><a href="https://developer.samsung.com/blockchain" target="_blank" class='blue--text text--darken-3 ml-2'>Samsung BlockChain Wallet</a></li>
      -->
      <li class='mt-4'>This is the very first project. We look forward to meeting you someday!</li>
  </ul>
  `},
  // 4. Diary
  {tag : `
    <ul>
      <li class='mt-2'><b>Chilly Thursday, December 19, 2019</b></li>
      <li class='mt-2'>I've updated the system of football match statistics. It is also improved the module of player rank. Actually I don't know whether players will like it or not. All I can do is try. </li>
      <li class='mt-2'>I'm sleepy.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Warm Sunday, December 8, 2019</b></li>
      <li class='mt-2'>Some VCs told me, they can't invest in my company even though I've done well. Because their money is from the government. They said all sources of VC funds are from there.</li>
      <li class='mt-2'>I met my former coworkers a few days ago. They suggested to me that we build a new company together. They told me, if we join together, we can easily get government funding. They said, we just need to make any rough business idea that the government likes.</li>
      <li class='mt-2'>I thought they have no entrepreneurship. It was difficult to think it's right.</li>
      <li class='mt-2'>I concluded that I don't need the money of any VCs. I will grow my company based on trust little by little. I will not be swayed any more.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Sunny day. Tuesday, November 26, 2019</b></li>
      <li>It's difficult to understand why people didn't request me any bonus even though they place the bets on the matches.</li>
      <li>The autumn has come to river. It glows the face of everything with yellow paint.</li>
      <li><img style='max-width:100%;height:auto;' class='mt-2' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/diary/photo_2019-11-26_20-13-20.jpg'/ ></li>
      <li class='mt-2'>I will meet some VCs tomorrow. Not much to expect but it will be interesting.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>It rained all day long. Sunday, November 17, 2019</b></li>

      <li class='mt-2'>I understand this field little by little. I can feel it get business muscles.</li>
      <li>Some cheered me. Kristina, Hot dog, and the official. I was really encouraged.</li>
      <li>What a warm world! It may take a few years. I will gain the trust of the world. I will make to grow this company the best in the world. It's alright to take years or decades.</li>
      <li>I place bet my destiny in this field, too.</li>
    </ul>
    <ul>
    <ul>
      <li class='mt-5'><b>Autumn has come. Monday, November 4, 2019</b></li>
      <li class='mt-2'>The lower left eye vibrates.</li>
      <li>Looking at the mirror, I think it's swollen.</li>
      <li>I took a walk late at night.</li>
      <li>Walking and walking in the cold wind did not cool my head.</li>
      <li>I thought I wanted to pull out my brain and soak it in ice water.</li>
      <li>I wanted to pour cold water on the empty spot where my brain was pulled out and wet my spine.</li>
      <li>Even if I wake up from sleep, the heat in my face won't go away.</li>
      <li>I hope to remember this moment as a romance later on.</li>
      <li>Please.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>It rained suddenly. Tuesday, October 29, 2019</b></li>
      <li class='mt-2'>Yesterday was my birthday.</li>
      <li>Allday, I debugged the nonce problem of ethereum. It causes a problem dealing with transactions simultaneously.</li>
      <li>It rained suddenly late at night. The sound was good to hear.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Weather like before. Sunday, October 20, 2019</b></li>
      <li class='mt-2'>I got hurt.</li>
      <li>I realized how deficient I was. I hardly slept. That was my fault. </li>
      <li>If I am frustrated, I become a normal person. I don't want me to be like that. I need some sleep.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Chill day, too. Tuesday, October 16, 2019</b></li>
      <li class='mt-2'>In the blockchain conference room, I left my business cards here and there secretly. I was ashamed. I'm familiar with making something, but I don't know what to do with marketing. I am keep thinking.</li>
      <li>I wanted to be a businessman. That's why I learned development. So this is exactly what I've dreamed of. I believe I'll achieve a breakthrough. Gogogo.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Chilly day. Tuesday, October 15, 2019</b></li>
      <li class='mt-2'>I think my English seems to make players who visited WB, uncomfortable.</li>
      <li>The number of visitors remains the same. After making the video, I should start advertising.</li>
      <li class='mt-2'></li>
      <li>I'm not sure of anything yet.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Clear weather. Wednesday, October 9, 2019</b></li>
      <li class='mt-2'>I am making the guide page that "How to bet". It makes me exhausted. I haven't finished it yet.</li>
      <li>Some guys offered me SNS marketing and promotion via Telegram. I couldn't decide what I will do. I don't know about this industry yet. I need a time. I think, I need more time.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Clear weather. Sunday, October 7, 2019</b></li>
      <li class='mt-2'>I've made coin system. I gave the coin name what is "white" written by "W". wB gives this to all players who bet the game as much as their stake. I'll try to balance out 1.0W is about a hundredth of 1 ETH.</li>
      <li class='mt-2'>While I was developing it, I listened to the sound(not screen) of the movie, 'Il mare'. Already I watched it more than 10 times, but it was still moved. Maybe because I drunk two cans of beer. hh</li>
      <li class='mt-2'>It was a little chilly day. Even though I didn't go out, I could know. Yes, I could know.</li>
      <li class='mt-2'>I will make a video about how to bet a wB game tomorrow. I'm tired. End.</li>
    </ul>
    <ul>
      <li class='mt-5'><b>Clear weather, Friday, October 5, 2019</b></li>
      <li class='mt-2'>Today is the first day of making this page. I've decided to write letters all about managing wB on this page in English, even though my English is bad. I don't know how much you are interested in this. I just want to try to show itself without hiding anything.</li>
      <li class='mt-2'>Actually, I made this all by myself. So it's not the exact expression "we" who I've written on the page of Terms of service. Maybe I wanted to use the term "we" to indicate that there is a group behind me. I might have wanted to look something great. But I don't have any of my sides yet. hh</li>
      <li class='mt-2'>Tomorrow, I will make 'white coin system'. Players can get 'white' as much ETH as they bet on after he bet a game. I think this system will make a difference from similar games that may come forward. Of course, I would be happy to have that future.</li>
      <li class='mt-2'>And I have to include "HTML editor" which I can write these letters. Now I am writing by "real HTML tag"</li>
      <li class='mt-2'></li>
      <li class='mt-2'>I spent a lot of time. English is harder than coding for me. Okay, end.</li>
    </ul>
  `},
  // 5. Terms of service
  {tag : `
    <ul><li>The web site of whitebettting ("we) provides the interface to the Smart Contract on the Ethereum blockchain, which accepts ETH tokens and transfers varying amounts of ETH tokens in return, depending on external factors.</li>

    <li class="mt-3">We are not able to verify the legality of the service in each jurisdiction and provide you with any legal advice. It is your sole responsibility to comply with any relevant laws, policies and regulations of your jurisdiction regarding the use of ETH tokens in the way described above.</li>

    <li class="mt-3">We don't know who you are, where you live. Even we don't store your IP. We only access your EOA(External Owned Account) not any of your information. </li>

    <li class="mt-3">Playing the games offered by us can lead to obtainment or loss of ETH tokens. We guarantee 100% to give prize ETH by the game result. Please send the <a href='mailto:ufo@whitebetting.com' target="_blank" class="blue--text">email</a> or leave a message on <a href="https://t.me/whitebettingOfficial" target="_blank" class="blue--text">Telegram</a> whenever, if you win a bet but you didn't get prize ETH. We will give prize ETH directly within 24h.</li>

    <li class="mt-3">We wish you please to be happy with us.</li>
    <li class='mt-3'>Last updated on：October 4, 2019</li></ul>
  `},
]


export default {
  name: 'Info',
  // components: { Loading },
  mixins: [mixinDataAnal],
  data () {
    return {
      isMobile : '',
      pageName : '',
      pageNumber : '',
      msgCategory : '',

      loader :{ gameList : false },
    }
  },
  methods : {
    _makePage(whatPage){
      this.isMobile = isMobile;
      let pageName = ''; // page 정보 알아낸 후 보여주기
      let pageNumber = 0; // page number에 따라 카테고리 표시를 달리하기 위해
      switch(whatPage){
        // case 'howtobet'       : pageName = 'How to bet'; pageNumber = 1;this.dataAnalysis(20100); break;
        case 'aboutwb'        : pageName = 'About wB'; pageNumber = 2; this.dataAnalysis(20102);break;
        case 'contactus'      : pageName = 'Contact us'; pageNumber = 3; this.dataAnalysis(20103);break;
        case 'diary'          : pageName = 'Diary'; pageNumber = 4; this.dataAnalysis(20104);break;
        // case 'privacypolicy'  : pageName = 'Privacy Policy'; pageNumber = 6; break;
        case 'termsofservice' : pageName = 'Terms of service'; pageNumber = 5;this.dataAnalysis(20105); break;
      }
      this.pageName = pageName;
      this.pageNumber = pageNumber;
      this.msgCategory = htmlEl[pageNumber];

    },

  },
  async created(){
    this.deleteHelloDom();    
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로
    this._makePage(this.$route.params.name);

  },
  beforeCreate(){ // 세션처리는 Toolbar에서 한다
  },
  computed : {
		...mapState([ // state는 computed에 넣는다
			'userAccount', 'loadingStatus',
    ]),
  },
  watch: {
    '$route.params.name' : function (whatPage) {
      this._makePage(whatPage); // vue에서 route의 params이 변경되면 감시하다가 바로 적용
    }
  },
}

</script>

<style scoped>
.infoPage{max-width: 850px;}
.infoCategory{font-size:14px;}
.selectedCategory{font-weight:bold; text-decoration: underline;}

@media screen and (min-width:0px) and (max-width: 960px){

}
</style>

