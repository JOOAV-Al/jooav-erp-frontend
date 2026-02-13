// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { DrawerTabsProps } from "@/interfaces/general";

// const DrawerTabs = ({ tabs }: DrawerTabsProps) => {
//   return (
//     <div className="flex w-full flex-col gap-6">
//       <Tabs defaultValue={tabs[0]?.value} className="">
//         <div className="border-b-2 border-[#EDEDED]">
//           <TabsList className="px-xl">
//             {tabs?.map((tab, i) => (
//               <TabsTrigger key={i} value={tab.value}>
//                 {tab?.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>
//         {tabs?.map((tab, i) => (
//           <TabsContent
//             key={i}
//             value={tab.value}
//             className="px-xl py-main flex flex-col gap-main"
//           >
//             <div className="flex justify-between items-center gap-5">
//               <div className="flex gap-[8px] items-center">
//                 <h4 className="leading-[1.2] tracking-[0.01]">{tab?.heading ?? ""}</h4>
//                 {tab?.statusTag && <div>{tab?.statusTag}</div>}
//               </div>
//               {tab?.actionDropdown && <div>{tab?.actionDropdown}</div>}
//             </div>
//             {tab?.content}
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// };

// export default DrawerTabs;

import Spinner from "@/components/general/Spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DrawerTabsProps } from "@/interfaces/general";

const DrawerTabs = ({ tabs }: DrawerTabsProps) => {
  return (
    <Tabs
      defaultValue={tabs[0]?.value}
      className="flex flex-col flex-1 min-h-0 w-full"
    >
      {/* Tab triggers — never scrolls */}
      <div className="border-b-2 border-[#EDEDED] shrink-0">
        <TabsList className="px-xl">
          {tabs?.map((tab, i) => (
            <TabsTrigger key={i} value={tab.value}>
              {tab?.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs?.map((tab, i) => (
        <TabsContent
          key={i}
          value={tab.value}
          className="flex flex-col flex-1 min-h-0 mt-0"
        >
          {/* Tab heading + action dropdown — never scrolls */}
          <div className="px-xl pt-main shrink-0 flex justify-between items-center gap-5 pb-main">
            <div className="flex gap-[8px] items-center">
              <h4 className="leading-[1.2] tracking-[0.01]">
                {tab?.heading ?? ""}
              </h4>
              {tab?.statusTag && <div>{tab?.statusTag}</div>}
              {tab?.loading && <Spinner className="w-4 h-4" />}
            </div>
            {tab?.actionDropdown && <div>{tab?.actionDropdown}</div>}
          </div>

          {/* Scrollable content area */}
          <ScrollArea isSidebar className="flex-1 min-h-0 overflow-y-auto">
            <div className="px-xl">{tab?.content}</div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DrawerTabs;