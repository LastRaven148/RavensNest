import { useState } from "react";

export default function SettingsModal({
  bio,
  setBio,
  saveBio,
  onClose
}) {

  const [value, setValue] =
    useState(bio);

  function handleSave() {

    saveBio(value);

    onClose();

  }

  return (

    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="settings-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <h2>Profile</h2>

        <textarea
          value={value}
          onChange={(e) =>
            setValue(
              e.target.value
            )
          }
          placeholder="Your bio..."
        />

        <div className="settings-actions">

          <button
  className="save-button"
  onClick={handleSave}
>
  Done
</button>

          <button
  className="close-button"
  onClick={onClose}
>
  Close
</button>

        </div>

      </div>

    </div>

  );
}