import Row from "./Row";

export default function LoadingSpinner({ size = 12, thickness = 2, className = "" }: { size?: number, thickness?: number, className?: string }) {
    return (
        <Row classes="items-center gap-2">
            <p className="">Loading...</p>
            
            <div
                className={`animate-spin rounded-full border-neutral-500 border-t-white ${className}`}
                style={{
                    width: size,
                    height: size,
                    borderWidth: thickness
                }}
            />
        </Row>
        
    );
}