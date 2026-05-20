import re

def patch_file(filepath, compile_btn_color, hover_btn_color, active_bg, active_border):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove Compose button from header
    header_regex = r'<header.*?</header>'
    header_match = re.search(header_regex, content, re.DOTALL)
    if header_match:
        header_text = header_match.group(0)
        # remove the button tag containing Compose
        button_regex = r'<button @click="isComposeOpen = true".*?</button>'
        new_header = re.sub(button_regex, '', header_text, flags=re.DOTALL)
        content = content.replace(header_text, new_header)

    # 2. Replace the Left Sidebar and Middle Pane setup
    main_regex = r'(<!-- Left Sidebar: Message List -->.*?)(<!-- Right Content: Message Detail -->)'
    main_match = re.search(main_regex, content, re.DOTALL)
    if main_match:
        old_main = main_match.group(1)
        
        new_main = f"""<!-- Left Sidebar: Navigation -->
                <div class=\"w-64 flex-shrink-0 flex flex-col gap-6\">
                    <button @click=\"isComposeOpen = true\"
                        class=\"w-full flex items-center justify-center gap-2 px-4 py-3 {compile_btn_color} {hover_btn_color} text-white font-medium rounded-xl transition-colors shadow-sm\">
                        <PencilSquareIcon class=\"w-5 h-5\" />
                        Compose
                    </button>
                    
                    <nav class=\"flex flex-col gap-1\">
                        <button @click=\"activeFolder = 'inbox'; selectedMessage = null\" :class=\"[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'inbox' ? '{active_bg} text-{active_border}-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                        ]\">
                            <div class=\"flex items-center gap-3\">
                                <InboxIcon class=\"w-5 h-5\" />
                                Inbox
                            </div>
                            <span v-if=\"inboxUnreadCount > 0\" class=\"{active_bg} text-{active_border}-700 py-0.5 px-2 rounded-full text-xs font-bold\">{{{{ inboxUnreadCount }}}}</span>
                        </button>
                        <button @click=\"activeFolder = 'sent'; selectedMessage = null\" :class=\"[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'sent' ? '{active_bg} text-{active_border}-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                        ]\">
                            <div class=\"flex items-center gap-3\">
                                <PaperAirplaneIcon class=\"w-5 h-5\" />
                                Sent
                            </div>
                        </button>
                    </nav>
                </div>

                <!-- Middle Pane: Message List -->
                <div class=\"w-80 min-w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden\">
                    <div class=\"p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center\">
                        <h2 class=\"font-semibold text-gray-900\">{{{{ activeFolder === 'inbox' ? 'Inbox' : 'Sent' }}}}</h2>
                    </div>

                    <div class=\"flex-1 overflow-y-auto custom-scrollbar bg-white\">
                        <div v-if=\"filteredMessages.length === 0\" class=\"h-full flex flex-col items-center justify-center text-center p-6 bg-white min-h-[400px]\">
                            <ChatBubbleLeftRightIcon class=\"w-12 h-12 text-gray-300 mb-3\" />
                            <p class=\"text-gray-500 font-medium\">No messages in {{{{ activeFolder }}}}</p>
                        </div>

                        <div v-else class=\"divide-y divide-gray-100\">
                            <div v-for=\"msg in filteredMessages\" :key=\"msg.id\" @click=\"selectedMessage = msg\" :class=\"[
                                'p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4',
                                selectedMessage?.id === msg.id ? '{active_bg}/50 border-{active_border}-500' : 'border-transparent'
                            ]\">
                                <div class=\"flex justify-between items-start mb-1\">
                                    <h3 :class=\"['text-sm font-semibold truncate', !msg.read && activeFolder === 'inbox' ? 'text-gray-900' : 'text-gray-700']\">
                                        {{{{ activeFolder === 'inbox' ? msg.sender : msg.recipient }}}}
                                    </h3>
                                    <span class=\"text-xs text-gray-400 whitespace-nowrap ml-2\">{{{{ msg.date }}}}</span>
                                </div>
                                <p :class=\"['text-sm mb-1 truncate', !msg.read && activeFolder === 'inbox' ? 'text-gray-900 font-medium' : 'text-gray-600']\">
                                    {{{{ msg.subject }}}}
                                </p>
                                <p class=\"text-xs text-gray-400 truncate\">{{{{ msg.preview }}}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                """
        content = content.replace(old_main, new_main)
        
        # Add inboxUnreadCount to script
        if 'const inboxUnreadCount' not in content:
            script_add = r'const filteredMessages = computed(() => activeFolder.value === \'inbox\' ? inbox.value : sent.value)'
            new_script = script_add + "\nconst inboxUnreadCount = computed(() => inbox.value.filter(m => !m.read).length)\n"
            content = content.replace(script_add, new_script)

        with open(filepath, 'w') as f:
            f.write(content)
        print("Patched", filepath)
    else:
        print("Could not find main section in", filepath)

patch_file('pages/investor/messages.vue', 'bg-[#198754]', 'hover:bg-[#157347]', 'bg-emerald-50', 'emerald')
patch_file('pages/sme/messages.vue', 'bg-teal-600', 'hover:bg-teal-700', 'bg-teal-50', 'teal')

