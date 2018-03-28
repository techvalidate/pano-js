import { load as onLoad } from '@pano/global/ui'
import 'jquery-minicolors'

onLoad(() =>
  // =====================================================
  // color pickers
  // =====================================================

  $('.color-picker-text-field').minicolors()
);
