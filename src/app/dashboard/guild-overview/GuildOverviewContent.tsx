import { MillisecondsToParts } from "@/_Helpers/MillisecondsToParts";
import Col from "@/components/Col";
import Row from "@/components/Row";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function GuildOverviewContent({ guildData, DBGuildData }: { guildData: any, DBGuildData: any }) {
    return (
        <Col classes="p-1.5 bg-teal-950 rounded-md gap-1.5">

            <Row classes="items-center gap-2">
                <p className="">Guild:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{guildData.name}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Guild ID:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{DBGuildData._id}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Status:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{DBGuildData.active ? <p className="p-0.5 px-1.5 bg-green-400/30 border-1 border-green-400 rounded-sm text-xs">Active</p> : <p className="p-0.5 px-1.5 bg-red-400/30 border-1 border-red-400 rounded-sm text-xs">Inactive</p>}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Access Role:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{DBGuildData.accessRole.trim().length === 0 ? "None" : DBGuildData.accessRole}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">NSFW Role:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{DBGuildData.nsfwRole.trim().length === 0 ? "None" : DBGuildData.nsfwRole}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Management Allowlist Roles:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{DBGuildData.permittedToVerify.length === 0 ? "Owner Only" : DBGuildData.permittedToVerify.join(", ")}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Moderation Logs Channel:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{!DBGuildData.moderationLogChannel ? "None" : DBGuildData.moderationLogChannel}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Member Join Logs Channel:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{!DBGuildData.memberJoinLogs ? "None" : DBGuildData.memberJoinLogs}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Member Leave Logs Channel:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{!DBGuildData.memberLeaveLogs ? "None" : DBGuildData.memberLeaveLogs}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Total Members:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{!DBGuildData.totalMembers ? "Unknown" : DBGuildData.totalMembers}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Cummulative Time in VC:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{!DBGuildData.vcTotalTime ? "Unknown" : MillisecondsToParts(DBGuildData.vcTotalTime)}</div>
            </Row>

            <Row classes="items-center gap-2">
                <p className="">Total Messages Sent:</p>
                <div className="p-1 bg-zinc-900 rounded-md">{!DBGuildData.totalMessages ? "Unknown" : MillisecondsToParts(DBGuildData.totalMessages)}</div>
            </Row>

        </Col>
    );
}

/*
{
  "_id": "68cf0d609a0d43be5bab0e0a",
  "guildID": "1417679566532509799",
  "accessRole": "1417683576962678794",
  "active": true,
  "nsfwRole": "1417712202151891045",
  "permittedToVerify": [
    "1417681126549356564",
    "1417680895846121573",
    "1417680520237678692",
    "1417681348381900890",
    "1417682399571218482"
  ],
  "moderationLogChannel": "1419457511605538817",
  "totalMessages": 2553,
  "vcTotalTime": 381477378,
  "totalMembers": 36,
  "memberLeaveLogs": "1421558248959643748",
  "memberJoinLogs": "1417692099003940955"
}
  */