declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
declare module '@/utils/platform' {
  const isH5: boolean;
  const isWeixin: boolean;
  export { isH5, isWeixin };
}