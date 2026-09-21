

<script setup lang="ts">


const _props = defineProps<{
  title?:string;
  description?:string
  titleClassName?:string
  descriptionClassName?:string;
  titleDescriptionClassName?:string
  headerClassName?:string;
  contentClassName?:string
  loading?:boolean;
  disabled?:boolean
}>()



</script>



<template>
   <div  
   v-bind="$attrs"
   class="bg-white sm:p-6 p-4 w-full h-full rounded-lg shadow-sm ">
     

    <div :class="headerClassName" class="flex items-center gap-4" >

      <slot name="left"/>
      <slot name="header">
        <div :class="titleDescriptionClassName" class="flex-1">
          <h4 v-html="title"  :class="titleClassName"
          class="font-display text-lg font-medium"
          />
          <p v-html="description" :class="descriptionClassName"
          class="text-xs text-muted-foreground"
          />
        </div>
      </slot>
      <slot name="right"/>
    </div>

    <div
    :class="contentClassName"
    class=""
    >
      <slot  ></slot>
    </div>
   </div>
</template>