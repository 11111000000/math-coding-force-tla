{
  description = "MathCoding reproducible environment for TLA+ based mathematical development";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSystem = nixpkgs.lib.genAttrs systems;
    in {
      apps = forEachSystem (system: {
        mathpacket = {
          type = "app";
          program = "${self}/bin/mathpacket";
          meta.description = "Create a canonical MathCoding task packet";
        };
        tla-sany = {
          type = "app";
          program = "${self}/bin/tla-sany";
          meta.description = "Run SANY on a TLA+ spec using discovered tla2tools.jar";
        };
        tla-tlc = {
          type = "app";
          program = "${self}/bin/tla-tlc";
          meta.description = "Run TLC on a TLA+ spec using discovered tla2tools.jar";
        };
        tla-tlaps = {
          type = "app";
          program = "${self}/bin/tla-tlaps";
          meta.description = "Run TLAPS proof-producing verification";
        };
        verify = {
          type = "app";
          program = "${self}/bin/verify";
          meta.description = "Run mechanical SANY/TLC/TLAPS verification and write verification.json";
        };
        validate-packet = {
          type = "app";
          program = "${self}/bin/validate-packet";
          meta.description = "Perform lightweight structural validation of a MathCoding packet";
        };
        refine-from-model = {
          type = "app";
          program = "${self}/bin/refine-from-model";
          meta.description = "Regenerate refinement.md and traceability.json skeleton from Model.tla";
        };
      });
      devShells = forEachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in {
          default = pkgs.mkShell {
            name = "mathcoding";
            packages = with pkgs; [
              jdk21
              python3
            ];
            shellHook = ''
              export PATH="$PWD/bin:$PATH"
              echo "MathCoding shell active"
              echo "Wrappers: mathpacket, tla-sany, tla-tlc, tla-tlaps, verify, validate-packet, refine-from-model"
              echo "Set TLA2TOOLS_JAR or place tla2tools.jar under tools/"
              echo "Place tlapm under tools/tlaps/bin/tlapm or set TLAPM_BIN"
            '';
          };
        });
    };
}