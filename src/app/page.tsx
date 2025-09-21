import Col from "@/components/Col";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export default async function Home() {
    return (
        <Col className="w-full">
            <Menubar className="bg-neutral-950 text-neutral-50 border-neutral-700">
                <MenubarMenu>
                    <MenubarTrigger className="text-neutral-50 border-neutral-700 data-[state=open]:bg-neutral-800 data-[state=open]:text-neutral-50 focus:bg-neutral-800 focus:text-neutral-50 hover:bg-neutral-700 cursor-pointer">Guilds</MenubarTrigger>
                    <MenubarContent className="bg-neutral-800 text-neutral-50 border-neutral-700">

                        <MenubarItem className="focus:bg-neutral-600 focus:text-neutral-50 cursor-pointer">List</MenubarItem>

                        <MenubarItem className="focus:bg-neutral-600 focus:text-neutral-50 cursor-pointer">Stats</MenubarItem>

                    </MenubarContent>
                </MenubarMenu>
                </Menubar>
        </Col>
    );
}
