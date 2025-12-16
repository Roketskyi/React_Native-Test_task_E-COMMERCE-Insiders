export type RootStackParamList = {
  '(tabs)': undefined;
  'auth': undefined;
  'product-details': {
    product: string;
  };
  'checkout': undefined;
  'modal': undefined;
};

export type TabParamList = {
  'index': undefined;
  'cart': undefined;
  'profile': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}