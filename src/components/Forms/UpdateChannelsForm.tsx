"use client";

import { ActionUpdateChannels, ActionUpdateChannelsReturn } from "@/_Actions/ActionUpdateChannels";
import Col from "../Col";
import Row from "../Row";
import { useActionState, useEffect, useMemo, useState } from "react";
import FormSubmitButton from "../Buttons/FormSubmitButton";
import ErrorMessage from "../Messages/ErrorMessage";
import Dropdown from "../Inputs/Dropdown";
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function UpdateChannelsForm({ guildID, guildData, channels }: { guildID: string, guildData: any, channels: Array<any> }) {
    const initial = useMemo(() => ({
        success: false,
        message: undefined,
        memberJoinChannel: guildData?.memberJoinLogs ?? "",
        memberLeaveChannel: guildData?.memberLeaveLogs ?? "",
        modLogChannel: guildData?.moderationLogChannel ?? "",
        reportsChannel: guildData?.reportsChannel ?? ""
    }), [guildData]);
    const [serverState, action] = useActionState(ActionUpdateChannels, initial);
    const [draft, setDraft] = useState<ActionUpdateChannelsReturn>(initial);
    const [modified, setModified] = useState<boolean>(false);

    useEffect(() => setDraft(initial), [guildID, initial]);

    useEffect(() => {
        if (serverState.success) {
            setDraft(serverState);
            setModified(false);
        }
    }, [serverState]);

    return (
        <form
            action={action}
            className="
                p-1.5
                
                bg-gradient-to-br
                from-teal-950
                via-teal-800
                via-teal-700
                to-teal-800

                rounded-md
                gap-1.5
            "
        >
            {/*
            - set member join channel
            - set member leave channel
            - set moderation log channel
            - set reports channel
            */}

            <input type="hidden" name="guild-id" value={guildID} />

            <Col>
                <label htmlFor="memberJoinChannel">Member Join Logs Channel</label>
                <Dropdown
                    name="memberJoinChannel"
                    value={draft.memberJoinChannel}
                    onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                        setDraft(prev => ({ ...prev, memberJoinChannel: e.target.value }));
                        setModified(true);
                    }}
                >
                    {
                        channels.map((channel: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            <Col>
                <label htmlFor="memberLeaveChannel">Member Leave Logs Channel</label>
                <Dropdown
                    name="memberLeaveChannel"
                    value={draft.memberLeaveChannel}
                    onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                        setDraft(prev => ({ ...prev, memberLeaveChannel: e.target.value }));
                        setModified(true);
                    }}
                >
                    {
                        channels.map((channel: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            <Col>
                <label htmlFor="modLogChannel">Moderation Logs Channel</label>
                <Dropdown
                    name="modLogChannel"
                    value={draft.modLogChannel}
                    onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                        setDraft(prev => ({ ...prev, modLogChannel: e.target.value }));
                        setModified(true);
                    }}
                >
                    {
                        channels.map((channel: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            <Col>
                <label htmlFor="reportsChannel">Reports Channel</label>
                <Dropdown
                    name="reportsChannel"
                    value={draft.reportsChannel}
                    onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                        setDraft(prev => ({ ...prev, reportsChannel: e.target.value }));
                        setModified(true);
                    }}
                >
                    {
                        channels.map((channel: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            {
                !draft.success && draft.message &&
                <Col>
                    <ErrorMessage title=":(" description={draft.message} />
                </Col>
            }

            {
                modified &&
                <Row classes="justify-end">
                    <FormSubmitButton text="Update Channels" />
                </Row>
            }
            
        </form>
    );
}