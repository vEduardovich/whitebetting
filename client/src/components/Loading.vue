<template>
  <!-- loading component -->
  <v-dialog v-model="loadingStatus" fullscreen full-width>
    <v-container fluid fill-height class='bgColor'>
      <v-layout justify-center align-center>
        <v-progress-circular
          indeterminate
          color="primary">
        </v-progress-circular>
      </v-layout>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name : 'Loading',
	data () {
		return {
    }
	},
	methods: {

	},

	computed : {
		...mapState([ // state는 computed에 넣는다
			'loadingStatus',
		]),

	},
	watch : {

	},
	async created(){

	},
}
</script>

<style scoped>
.bgColor{background-color: rgba(255, 255, 255, 0.5);}

</style>
