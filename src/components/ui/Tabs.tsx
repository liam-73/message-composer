import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';

interface TabsContextValue {
  value?: string;
  setValue: (value: string) => void;
  tabsId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = ({ value, defaultValue, onValueChange, className, children, ...props }: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;
  const tabsId = useId();

  const handleChange = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      value: activeValue,
      setValue: handleChange,
      tabsId,
    }),
    [activeValue, handleChange, tabsId],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('flex flex-col gap-3', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'inline-flex h-12 items-center justify-start rounded-lg bg-gray-50 p-1 overflow-x-auto whitespace-nowrap gap-1',
      className,
    )}
    {...props}
  />
);

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: ReactNode;
}

export const TabsTrigger = ({ value, className, children, icon, ...props }: TabsTriggerProps) => {
  const context = useTabsContext();
  const isActive = context.value === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`${context.tabsId}-content-${value}`}
      id={`${context.tabsId}-trigger-${value}`}
      onClick={() => context.setValue(value)}
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        'flex h-10 w-full min-w-fit items-center gap-2 rounded-md px-4 text-sm font-medium transition-all',
        isActive
          ? 'bg-white text-blue-600'
          : 'text-gray-600 hover:text-gray-900 hover:bg-white/70',
        className,
      )}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = ({ value, className, children, ...props }: TabsContentProps) => {
  const context = useTabsContext();
  const isActive = context.value === value;

  if (!isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${context.tabsId}-content-${value}`}
      aria-labelledby={`${context.tabsId}-trigger-${value}`}
      className={cn('focus:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>');
  }
  return context;
};

