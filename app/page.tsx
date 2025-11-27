<Controller
  name="message"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel
        htmlFor="chat-form-message"
        className="sr-only"
      >
        Message
      </FieldLabel>
      <div className="relative h-13">
        <Input
          {...field}
          id="chat-form-message"
          className="h-15 pr-20 pl-5 rounded-[20px] bg-input-box shadow-md text-white"
          placeholder="Type your message here…"
          disabled={status === "streaming"}
          aria-invalid={fieldState.invalid}
        />

        {/* 🎙 Mic button (audio input) */}
        <Button
          type="button"
          className="absolute right-11 top-3 rounded-full btn-mic"
          size="icon"
          onClick={handleMicClick}
        >
          {isRecording ? (
            <MicOff className="size-4" />
          ) : (
            <Mic className="size-4" />
          )}
        </Button>

        {/* Send / Stop buttons */}
        {(status === "ready" || status === "error") && (
          <Button
            className="absolute right-3 top-3 rounded-full btn-send"
            type="button"
            disabled={!field.value.trim()}
            size="icon"
            onClick={form.handleSubmit(onSubmit)}
          >
            <ArrowUp className="size-4" />
          </Button>
        )}

        {(status === "streaming" || status === "submitted") && (
          <Button
            className="absolute right-3 top-3 rounded-full btn-send"
            type="button"
            onClick={() => {
              stop();
            }}
          >
            <Square className="size-4" />
          </Button>
        )}
      </div>
    </Field>
  )}
/>
