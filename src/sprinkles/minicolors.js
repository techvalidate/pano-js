import $ from 'jquery'
import 'jquery-minicolors'
import { load } from '../utils/ui'


load(() =>
  // =====================================================
  // color pickers
  // =====================================================

  $('.color-picker-text-field').minicolors()
);
