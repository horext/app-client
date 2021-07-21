<template>
  <v-card>
    <v-stepper v-model="step">
      <v-stepper-header>
        <template v-for="component in components">
          <v-stepper-step
            :key="component.id"
            :complete="$route.params.step > component.id"
            :step="component.id"
          >
            {{ component.title }}
          </v-stepper-step>

          <v-divider v-if="component.id<3" :key="component.id+'steper'" />
        </template>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content
          v-for="component in components"
          :key="component.id"
          :step="component.id"
        >
          <component
            :is="component.component"
            v-if="step+1 > component.id"
            :ref="'item-'+component.id"
            :key="component.id"
            @enter="nextStep(component.id)"
          />
          <v-card-actions>
            <v-btn
              v-if="step> 1"
              outlined
              @click="backStep"
            >
              Atras
            </v-btn>
            <v-spacer />
            <v-btn
              outlined
              @click="nextStep(component.id)"
            >
              Siguiente
            </v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import SelectFacultyForm from '~/components/SelectFacultyForm.vue'
import SelectSpecialityForm from '~/components/SelectSpecialityForm.vue'
import SelectCoursesForm from '~/components/SelectCoursesForm.vue'

export default Vue.extend({
  name: 'FirstEntry',
  data () {
    return {
      components: [
        { id: 1, component: SelectFacultyForm, title: 'Selecciona tu facultad' },
        { id: 2, component: SelectSpecialityForm, title: 'Selecciona tu especialiad' },
        { id: 3, component: SelectCoursesForm, title: 'Selecciona tus cursos' }
      ]
    }
  },
  computed: {
    step: {
      get () {
        return this.$store.state.modules.UserModule.step
      },
      set (step) {
        this.$store.commit('modules/UserModule/setStep', step)
      }
    }
  },
  methods: {
    validateForm (window: any): any {
      const windows : any = this.$refs[window]
      return windows[0].validated()
    },
    backStep () {
      this.step--
    },
    async nextStep (id: number) {
      if (!await this.validateForm('item-' + id)) {
        return
      }
      this.step++
    }
  }
})
</script>
