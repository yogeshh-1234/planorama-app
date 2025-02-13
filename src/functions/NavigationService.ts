// NavigationService.ts
import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}
export function navigateReset(routes:any,index:number) {
  if (navigationRef.isReady()) {
    // navigationRef.navigate(name as never, params as never);
    navigationRef.dispatch(
      CommonActions.reset({
        index: index,
        routes: routes,
      }),
    );
  }
}
