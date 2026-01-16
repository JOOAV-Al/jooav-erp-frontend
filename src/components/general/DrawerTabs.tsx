import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DrawerTabsProps } from "@/interfaces/general";

const DrawerTabs = ({ tabs }: DrawerTabsProps) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue={tabs[0]?.value} className="">
        <div className="border-b-2 border-[#EDEDED]">
          <TabsList className="px-xl">
            {tabs?.map((tab, i) => (
              <TabsTrigger key={i} value={tab.value}>
                {tab?.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs?.map((tab, i) => (
          <TabsContent key={i} value={tab.value} className="px-xl py-main flex flex-col gap-main">
            <h3>{tab?.heading ?? ""}</h3>
            {tab?.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DrawerTabs;
