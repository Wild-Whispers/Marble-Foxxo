"use client";

import { ActionUpdateChannels } from "@/_Actions/ActionUpdateChannels";
import Col from "../Col";
import Row from "../Row";
import { useActionState, useEffect, useState } from "react";
import FormSubmitButton from "../Buttons/FormSubmitButton";
import ErrorMessage from "../Messages/ErrorMessage";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function UpdateChannels({ guildID, guildData, channels }: { guildID: string, guildData: any, channels: Array<any> }) {
    const [formValues, action] = useActionState(ActionUpdateChannels, {
        success: false,
        message: undefined,
        memberJoinChannel: guildData?.memberJoinLogs ?? "",
        memberLeaveChannel: guildData?.memberLeaveLogs ?? "",
        modLogChannel: guildData?.moderationLogChannel ?? "",
        reportsChannel: guildData?.reportsChannel ?? ""
    });
    const [modified, setModified] = useState<boolean>(false);

    useEffect(() => {
        if (formValues.success) setModified(false);
    }, [formValues]);

    return (
        <Col>
            <h1 className="text-2xl font-semibold">Channels</h1>

            <form
                action={action}
                className="
                    flex
                    flex-col
                    gap-2
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
                    <select
                        key={formValues.memberJoinChannel}
                        name="memberJoinChannel"
                        defaultValue={formValues.memberJoinChannel}
                        onChange={() => setModified(true)}
                        className="bg-neutral-900 text-white rounded-sm"
                    >
                        {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            channels.map((channel: any, i: number) => {
                                return <option key={i} value={channel.id}>#{channel.name}</option>
                            })
                        }
                    </select>
                </Col>

                <Col>
                    <label htmlFor="memberLeaveChannel">Member Leave Logs Channel</label>
                    <select
                        key={formValues.memberLeaveChannel}
                        name="memberLeaveChannel"
                        defaultValue={formValues.memberLeaveChannel}
                        onChange={() => setModified(true)}
                        className="bg-neutral-900 text-white rounded-sm"
                    >
                        {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            channels.map((channel: any, i: number) => {
                                return <option key={i} value={channel.id}>#{channel.name}</option>
                            })
                        }
                    </select>
                </Col>

                <Col>
                    <label htmlFor="modLogChannel">Moderation Logs Channel</label>
                    <select
                        key={formValues.modLogChannel}
                        name="modLogChannel"
                        defaultValue={formValues.modLogChannel}
                        onChange={() => setModified(true)}
                        className="bg-neutral-900 text-white rounded-sm"
                    >
                        {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            channels.map((channel: any, i: number) => {
                                return <option key={i} value={channel.id}>#{channel.name}</option>
                            })
                        }
                    </select>
                </Col>

                <Col>
                    <label htmlFor="reportsChannel">Reports Channel</label>
                    <select
                        key={formValues.reportsChannel}
                        name="reportsChannel"
                        defaultValue={formValues.reportsChannel}
                        onChange={() => setModified(true)}
                        className="bg-neutral-900 text-white rounded-sm"
                    >
                        {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            channels.map((channel: any, i: number) => {
                                return <option key={i} value={channel.id}>#{channel.name}</option>
                            })
                        }
                    </select>
                </Col>

                {
                    !formValues.success && formValues.message &&
                    <Col>
                        <ErrorMessage title=":(" description={formValues.message} />
                    </Col>
                }

                {
                    modified &&
                    <Row classes="justify-end">
                        <FormSubmitButton />
                    </Row>
                }
                
            </form>
        </Col>
    );
}