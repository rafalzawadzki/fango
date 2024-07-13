import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SheetConfigForm from "@/components/sheet-config-form";
import SlackConfigForm from "@/components/slack-config-form";

export default function Home() {
  return (
    <div className="flex items-center justify-end box-border h-full p-4 overflow-hidden">
      <div className="max-w-3xl w-[600px] h-full overflow-auto p-6 border rounded-xl">
        <Tabs defaultValue="google-sheet">
          <TabsList className="w-full">
            <TabsTrigger value="google-sheet" className="flex-1">Google Sheets</TabsTrigger>
            <TabsTrigger value="slack" className="flex-1">Slack</TabsTrigger>
          </TabsList>
          <TabsContent value="google-sheet">
            <SheetConfigForm />
          </TabsContent>
          <TabsContent value="slack">
            <SlackConfigForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

