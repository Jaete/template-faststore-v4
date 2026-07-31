import Button from './ui/Button/Button'
import IconButton from './ui/IconButton/IconButton'
import Logo from './ui/Logo/Logo'
import Dropdown from './ui/Dropdown/Dropdown'
import Toggle from './ui/Toggle/Toggle'
import HelpButton from './ui/HelpButton/HelpButton'
import Input from './ui/Input/Input'
import TopBar from './layout/TopBar/TopBar'
import Header from './layout/Header/Header'
import ProductGrid from './commerce/ProductGrid/ProductGrid'
import ModelQuickFilter from './commerce/ModelQuickFilter/ModelQuickFilter'
import SearchDrawer from './commerce/Search/Drawer/Drawer'
import Minicart from './commerce/Cart/Minicart/Minicart'
import ProductCard from './commerce/ProductCard/ProductCard'
import QuantitySelector from './commerce/QuantitySelector/QuantitySelector'
import Carousel from './ui/Carousel/Carousel'
import PlpBanner from './layout/PlpBanner/PlpBanner'
import CategoryQuickNavigation from './commerce/CategoryQuickNavigation/CategoryQuickNavigation'
import CategoryCard from './commerce/PopularCategories/CategoryCard/CategoryCard'
import PopularCategories from './commerce/PopularCategories/PopularCategories'
import Tabs from './ui/Tabs/Tabs'
import TabbedShelf from './commerce/TabbedShelf/TabbedShelf'
import Breadcrumb from './commerce/Breadcrumb/Breadcrumb'
import FaqAccordion from './layout/InstitutionalPage/FaqAccordion/FaqAccordion'
import ContactForm from './layout/InstitutionalPage/ContactForm/ContactForm'
import ContactMethod from './layout/InstitutionalPage/ContactMethod/ContactMethod'
import InstitutionalPage from './layout/InstitutionalPage/InstitutionalPage'
import Shelf from './commerce/Shelf/Shelf'
import Banner from './ui/Banner/Banner'
import Slideshow from './layout/Slideshow/Slideshow'
import Media from './ui/Media/Media'
import ProductInfo from './commerce/ProductInfo/ProductInfo'
import ProductAccordion from './commerce/ProductAccordion/ProductAccordion'
import CrossSelling from './commerce/CrossSelling/CrossSelling'
import SeoText from './layout/SeoText/SeoText'
import ColorPalette from './providers/ColorPalette/ColorPalette'

// Re-exports nomeados para uso direto entre componentes
export {
  Button,
  IconButton,
  Logo,
  Breadcrumb,
  ContactForm,
  ContactMethod,
  Dropdown,
  FaqAccordion,
  Toggle,
  HelpButton,
  Input,
  TopBar,
  Header,
  InstitutionalPage,
  SearchDrawer,
  Minicart,
  ProductCard,
  ProductGrid,
  QuantitySelector,
  Carousel,
  Shelf,
  PlpBanner,
  CategoryQuickNavigation,
  ModelQuickFilter,
  CategoryCard,
  PopularCategories,
  Tabs,
  TabbedShelf,
  Banner,
  Slideshow,
  Media,
  ProductInfo,
  ProductAccordion,
  CrossSelling,
  SeoText,
  ColorPalette,
}

/**
 * Default export: mapa de sections customizadas que o CMS resolve em runtime.
 * A chave deve ser idêntica ao `$componentKey` declarado no schema do CMS.
 * Apenas componentes que são sections (organismos) entram aqui.
 */
const COMPONENTS = {
  TopBar,
  Header,
  InstitutionalPage,
  SearchDrawer,
  Minicart,
  Breadcrumb,
  PlpBanner,
  CategoryQuickNavigation,
  ModelQuickFilter,
  ProductGrid,
  PopularCategories,
  TabbedShelf,
  Slideshow,
  ProductInfo,
  ProductAccordion,
  CrossSelling,
  SeoText,
  ColorPalette,
}

export default COMPONENTS
